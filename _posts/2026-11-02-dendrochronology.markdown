---
layout: post
title: "Using Arborism to Break the Confidentiality of Microsoft SQL Server's Always Encrypted (and Other TEE-Based Encrypted DBs)"
slug: dendrochronology
permalink: /blog/dendrochronology
tagline: "Embedded index metadata in Microsoft SQL Server's Always Encrypted (and many other enclave-based databases) reveals the plaintext histogram of encrypted data, allowing for strong plaintext recovery attacks"
description: "A single snapshot of TEE-based encrypted database indexes can reveal plaintext histograms and enable strong plaintext recovery without breaking the TEE."
author:
  name: Zachary Espiritu
  twitter: ZacharyEspiritu
  url: https://zacharyespiritu.com
image:
  path: /images/og-dendrochronology.png
  width: 1200
  height: 630
  alt: Title card reading Using Arborism to Recover Plaintexts beside a photo of tree growth rings
date: 2026-11-02
is_post: true
card_color: "#39735B"
ending:
  tagline: Check out the full paper!
  link: https://eprint.iacr.org/2026/2465
  link_text: read paper
---

# Introduction

[_Dendrochronology_](https://en.wikipedia.org/wiki/Dendrochronology), or the study of tree "growth rings" (as in, the plant), is the scientific method of assigning exact calendar years to annual growth rings in wood. Arborists use dendrochronology to infer events about a tree's surrounding  environment, allowing them to answer questions like: _What was the temperature in this region 100 years ago?_ _What year did a volcanic eruption in the area occur?_
This technique allows us to infer surprisingly detailed information about the past—all from a single _point-in-time_ snapshot of the tree.

<figure class="paper-figure" id="figure-dendrochronology">
  <div class="paper-figure-viewport">
    <img src="{{ '/images/dendrochronology.jpeg' | relative_url }}" alt="A person points to the visible growth rings of a large cut tree trunk." width="3169" height="2175">
  </div>
  <figcaption>Me, standing next to a cut tree trunk. This slice of the trunk exposes the growth rings from which my new <a href="https://eprint.iacr.org/2026/2465">research paper</a> gets its name.</figcaption>
</figure>

In my new, solo-authored [research paper](https://eprint.iacr.org/2026/2465) appearing at [ACM CCS 2026](https://www.sigsac.org/ccs/CCS2026/program/schedule.html) and at [BlackHat Europe 2026](https://blackhat.com/europe/briefings/schedule/index.html#dendrochronology-attacks-breaking-tee-based-encrypted-databases-without-breaking-the-tee-56307), I show that there's an analogous, exploitable phenomenon in the B<sup>+</sup>-tree indexes used in several encrypted databases based on _trusted execution environments_ (TEEs). Specifically, an attacker can recover a similar "growth ring" structure from a _single, point-in-time snapshot of the database's encrypted index_ that leaks the plaintext histogram of the database. This, in turn, allows the adversary to infer the plaintext of the underlying encrypted data—once again, under an extremely weak adversary model.

Despite how surprisingly simple this vulnerability is, it affects a multitude of encrypted databases, including:

- [Microsoft SQL Server's Always Encrypted with Secure Enclaves](https://learn.microsoft.com/en-us/sql/relational-databases/security/encryption/always-encrypted-enclaves?view=sql-server-ver17), which uses [Intel SGX](https://www.intel.com/content/www/us/en/products/details/processors/xeon/features/software-guard-extensions.html) or [Microsoft VBS enclaves](https://learn.microsoft.com/en-us/windows/win32/trusted-execution/vbs-enclaves)
- [Alibaba Cloud's ApsaraDB Always-Confidential](https://www.alibabacloud.com/help/en/rds/apsaradb-rds-for-mysql/always-confidential-database-public-preview/) with [Intel SGX](https://www.intel.com/content/www/us/en/products/details/processors/xeon/features/software-guard-extensions.html)
- Many other academic constructions (such as [StealthDB](https://petsymposium.org/popets/2019/popets-2019-0052.php) and [HeDB](https://www.usenix.org/conference/osdi23/presentation/li-mingyu), and [many](https://dl.acm.org/doi/abs/10.1145/2463676.2467797) [others](https://www.vldb.org/pvldb/vol14/p1019-sun.pdf) [which](https://www.vldb.org/pvldb/vol14/p2811-guo.pdf) [have been deployed as early as 2011](https://dl.acm.org/doi/10.1145/1989323.1989346))

## Why is this interesting?

<aside class="post-aside post-aside--references">
  <p>How much is okay to leak? That's a complicated question, and it's an active area of research that I have <a href="https://www.usenix.org/conference/usenixsecurity25/presentation/espiritu">some</a> <a href="https://cic.iacr.org/p/2/1/38">work</a> on, but we'll talk about an example of what can go wrong when you leak too much below. <a href="https://www.senykamara.com/">Seny Kamara</a> has some great expository blog posts on encrypted search that discuss some of these possible tradeoffs in more detail (start with <a href="https://esl.cs.brown.edu/blog/how-to-search-on-encrypted-data-introduction-part-1/">Part 1</a>).</p>
</aside>

_End-to-end encrypted databases_ aim to allow a client to end-to-end encrypt data between the client and an untrusted database server in such a way that allows the data to still issue queries over the data. Designing such a database is quite hard and not straightforward. Confidentiality (e.g., encryption) eliminates structure which we would normally use to search over the data efficiently, but, in some cases, we might be okay with leaking a little bit of information about the underlying plaintext in order to increase efficiency. Because of this, there is not really one "best" encrypted database scheme—it depends on your efficiency requirements and how much information you are willing to _leak_ to a potential adversary.

One way that industry and academic encrypted database designers in industry and academia have tried to simplify encrypted database design is by using _trusted execution environments_ (TEEs) like  [Intel SGX](https://www.intel.com/content/www/us/en/products/details/processors/xeon/features/software-guard-extensions.html), [AMD SEV](https://www.amd.com/en/developer/sev.html), and others. Instead of designing a new database engine from scratch, designers can leverage the claimed security guarantees of a TEE (namely, that the memory is confidential to adversaries that compromise the server) to supposedly "safely" reuse mature components of  existing plaintext database engines.

<aside class="post-aside post-aside--references" aria-label="Related research on attacks against trusted execution environments">
  <p>Non-exhaustive list of attacks against TEEs include <em>cache side channels</em> (<a href="https://www.usenix.org/system/files/conference/woot17/woot17-paper-brasser.pdf" title="Software Grand Exposure: SGX Cache Attacks Are Practical">Brasser et al.</a>, <a href="https://faculty.cc.gatech.edu/~genkin/papers/cacheQuote.pdf" title="CacheQuote: Efficiently Recovering Long-term Secrets of SGX EPID via Cache Attacks">Dall et al.</a>, <a href="https://doi.org/10.1145/3065913.3065915" title="Cache Attacks on Intel SGX">Götzfried et al.</a>, <a href="https://users.wpi.edu/~teisenbarth/pdf/SharedCacheAttackSnP2015.pdf" title="S$A: A Shared Cache Attack that Works Across Cores and Defies VM Sandboxing—and its Application to AES">Irazoqui et al.</a>, <a href="https://mlq.me/download/takeaway.pdf" title="Take A Way: Exploring the Security Implications of AMD's Cache Way Predictors">Lipp et al.</a>, <a href="https://yuval.yarom.org/pdfs/LiuYGHL15.pdf" title="Last-Level Cache Side-Channel Attacks are Practical">Liu et al.</a>, <a href="https://eprint.iacr.org/2017/618" title="CacheZoom: How SGX Amplifies the Power of Cache Attacks">Moghimi et al.</a>, <a href="https://rmpocalypse.github.io/rmpocalypse-CCS2025.pdf" title="RMPocalypse: How a Catch-22 Breaks AMD SEV-SNP">Schlüter et al.</a>, <a href="https://ieeexplore.ieee.org/document/9519461/" title="CacheOut: Leaking Data on Intel CPUs via Cache Evictions">Van Schaik et al.</a>, <a href="https://www.usenix.org/conference/usenixsecurity24/presentation/zhang-ruiyi" title="CacheWarp: Software-based Fault Injection using Selective State Reset">Zhang et al.</a>),
    <em>transient execution</em> (<a href="https://arxiv.org/abs/2108.04575" title="One Glitch to Rule Them All: Fault Injection Attacks Against AMD's Secure Encrypted Virtualization">Buhren et al.</a>, <a href="https://yinqian.org/papers/acsac21.pdf" title="TLB Poisoning Attacks on AMD Secure Encrypted Virtualization">Li et al.</a>, <a href="https://www.shwetashinde.org/publications/pfdefense_asiaccs16.pdf" title="Preventing Page Faults from Telling Your Secrets">Shinde et al.</a>, <a href="https://www.usenix.org/system/files/conference/usenixsecurity17/sec17-van_bulck.pdf" title="Telling Your Secrets Without Page Faults: Stealthy Page Table-Based Attacks on Enclaved Execution">Van Bulck et al.</a>, <a href="https://arxiv.org/abs/1705.07289" title="Leaky Cauldron on the Dark Land: Understanding Memory Side-Channel Hazards in SGX">Wang et al.</a>, <a href="https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/ctrlchannels-oakland-2015.pdf" title="Controlled-Channel Attacks: Deterministic Side Channels for Untrusted Operating Systems">Xu et al.</a>),
    <em>ciphertext-level vulnerabilities</em> (<a href="https://yinqian.org/papers/sp22b.pdf" title="A Systematic Look at Ciphertext Side Channels on AMD SEV-SNP">Li et al.</a>, <a href="https://heracles-attack.github.io/Heracles-CCS2025.pdf" title="Heracles: Chosen Plaintext Attack on AMD SEV-SNP">Schlüter et al.</a>, <a href="https://www.usenix.org/system/files/usenixsecurity25-yan-yuqin.pdf" title="Relocate-Vote: Using Sparsity Information to Exploit Ciphertext Side-Channels">Yan et al.</a>, <a href="https://yuanyuan-yuan.github.io/files/sp25-Cipher-Steal.pdf" title="CIPHERSTEAL: Stealing Input Data from TEE-Shielded Neural Networks with Ciphertext Side Channels">Yuan et al.</a>),
    <em>syscall/signal attacks</em> (<a href="https://www.usenix.org/conference/usenixsecurity24/presentation/schl%C3%BCter" title="HECKLER: Breaking Confidential VMs with Malicious Interrupts">Schlüter et al.</a>, <a href="https://ahoi-attacks.github.io/sigy/sigy_asiaccs25.pdf" title="Sigy: Breaking Intel SGX Enclaves with Malicious Exceptions &amp; Signals">Sridhara et al.</a>),
    <em>interconnect corruption attacks</em> (<a href="https://xca-attacks.github.io/breakfast/breakfast_oakland26.pdf" title="BreakFAST: Confused Deputy Attack on Infinity Fabric to Break AMD SEV-SNP">Giersfeld et al.</a>, <a href="https://xca-attacks.github.io/fabricked/fabricked_usenix26.pdf" title="FABRICKED: Misconfiguring Infinity Fabric to Break AMD SEV-SNP">Schlüter et al.</a>), and
    <em>memory bus interposition</em> (<a href="https://tee.fail/files/paper.pdf" title="TEE.fail: Breaking Trusted Execution Environments via DDR5 Memory Bus Interposition">Chuang et al.</a>, <a href="https://batteringram.eu/batteringram.pdf" title="Battering RAM: Low-Cost Interposer Attacks on Confidential Computing via Dynamic Memory Aliasing">De Meulemeester et al.</a>, <a href="https://www.usenix.org/conference/usenixsecurity20/presentation/lee-dayeol" title="An Off-Chip Attack on Hardware Enclaves via the Memory Bus">Lee et al.</a>, <a href="https://wiretap.fail/files/wiretap.pdf" title="WireTap: Breaking Server SGX via DRAM Bus Interposition">Seto et al.</a>).</p>
</aside>

Of course, this security guarantee relies on the assumption that we can trust the hardware of the TEE—and there is a rich line of work that shows confidentiality attacks on   the TEE primitive itself. These show that powerful, _persistent_ adversaries who can compromise various kernel components or  execute arbitrary code on the victim can break the confidentiality guarantees of TEEs.

But persistent adversaries are not the only adversaries relevant for real-world databases. [Commercial](https://cloud.google.com/security/report/resources/cloud-threat-horizons-report-h2-2025) [vendors](https://www.verizon.com/business/resources/reports/dbir) increasingly emphasize _weaker_ threat models in which an attacker  exfiltrates point-in-time _snapshots_ of database state.
Unlike strong persistent models which capture sustained server compromise, **snapshot models** capture incidents arising from  database user or server administrator compromise.

It was previously believed that, in the snapshot model, it was impossible to recover an important kind of leakage—histogram leakage—about the plaintext data stored in Always Encrypted with Secure Enclaves as it used randomized encryption.
In this new work, I show that a common algorithmic invariant leads to an extremely simple attack that reveals the plaintext histogram to a snapshot adversary—even if the adversary just gets _one_ snapshot of the encrypted database.

# The TEE-Hybrid Architecture

Microsoft's database falls into a category known as a **TEE-hybrid** database. The goal of this architecture is to allow an existing database engine to be used—mostly unmodified—with the exception of a small component which runs inside of the TEE.

Microsoft's database engine is based on B<sup>+</sup>-trees, which are search trees which map indexed attributes to their corresponding record IDs. Maintaining a B<sup>+</sup>-tree requires the server to perform comparison operations on the indexed attributes so it knows how to search for and where to store each attribute. However, the idea of encrypting attributes is in direct tension with this idea—how can the server maintain the required index structure if it only receives completely random ciphertexts?

The TEE-based approach solves this problem in the following way:

1. When the client wants to upload a record that contains an _encrypted attribute_, the client-side driver encrypts the indexed attribute using AES with a known _attribute key_. Then, it sends the ciphertext to the server.
2. Instead of using the plaintext comparison operators (which would be meaningless over the ciphertext), the TEE implements the comparison operator for index maintenence. When the server needs to compare two ciphertexts, it sends both ciphertexts to the TEE. The TEE internally knows the attribute key, so it can decrypt both ciphertexts, compare their plaintexts, and output a comparison result to the server.
3. This architecture allows the existing database engine to maintain the B<sup>+</sup>-tree essentially as normal—just by delegating comparison operations to the TEE—without ever revealing the plaintext values to the untrusted region of the server.

In <a href="#figure-encrypted-btree" data-figure-ref>the figure</a>, we show an B<sup>+</sup>-tree which stores encrypted attributes. The letters `A`, `B`, `C`, and `D` denote plaintext values, but those are not actually visible to the server since they are encrypted. Here, we can see that the server uses the TEE comparator to order ciphertexts by their plaintext values.

<figure class="paper-figure" id="figure-encrypted-btree">
  <div class="paper-figure-viewport">
    {% include blog_figures/encrypted-btree-index.html %}
  </div>
  <figcaption>A TEE-hybrid encrypted B<sup>+</sup>-tree, adapted from <a href="https://eprint.iacr.org/2026/2465.pdf">Figure 1 of the paper</a>.</figcaption>
</figure>

<aside class="post-aside post-aside--references">
<p>
  Recovering such a histogram was previously believed (including in <a href="https://dl.acm.org/doi/10.1145/3318464.3386141">Microsoft's own paper</a>) to require a stronger adversary who could <em>persistently</em> compromise the server or otherwise break the TEE's security guarantees.
</p>
</aside>


We can see that the storage of the index itself leaks _plaintext order_ of the ciphertexts. This is the observation that was exploited by [prior snapshot model cryptanalysis by Seah et al.](https://eprint.iacr.org/2024/1308). Notably, because the ciphertexts use a randomized encryption scheme, it does not leak the _frequency_, or the histogram of the records. In other words, from a single snapshot, an adversary cannot see which encrypted values are equal to each other.

Before we discuss how to extract frequency leakage, it's worth asking—does frequency leakage even matter?

# Yes, Frequency Leakage Matters

To understand why frequency leakage is dangerous, it is useful to compare it to _order-only_ leakage. Consider an encrypted column containing 10 encrypted patient ages and the adversary sees their ciphertexts stored in sorted plaintext order. That reveals which encrypted records come before others, but it doesn't reveal whether neighboring entries have the same age, where one age ends and the next begins, or even how many distinct ages appear. The 10 sorted entries could represent ten different ages, one age repeated ten times, or many possibilities in between.

<aside class="post-aside post-aside--references" aria-label="Related research on order and frequency leakage">
  <p>This observation about frequency leakage enables a line of inference attacks against <em>property-preserving encryption</em> (PPE) such as <em><a href="https://faculty.cc.gatech.edu/~aboldyre/papers/bclo.pdf">order-preserving</a> and <a href="https://eprint.iacr.org/2016/612">order-revealing encryption</a></em>.
    <a href="https://cs.brown.edu/people/seny/pubs/edb.pdf" title="Inference Attacks on Property-Preserving Encrypted Databases">Naveed et al.</a> proposed the first such inference attacks; <em>later attacks</em> include <a href="https://www.vldb.org/pvldb/vol11/p1715-bindschaedler.pdf" title="The Tao of Inference in Privacy-Protected Databases">Bindschaedler et al.</a>, <a href="https://www.microsoft.com/en-us/research/publication/what-else-is-revealed-by-order-revealing-encryption/" title="What Else is Revealed by Order-Revealing Encryption?">Durak et al.</a>, <a href="https://eprint.iacr.org/2016/895.pdf" title="Leakage-Abuse Attacks against Order-Revealing Encryption">Grubbs et al.</a>, <a href="https://eprint.iacr.org/2017/1086" title="Order-Revealing Encryption: File-Injection Attack and Forward Security">Wang and Zhao</a>.
    For prior discussions of the limitations of <em>order-only leakage</em>, see <a href="https://zacharyespiritu.com/papers/leafblower-sp2026.pdf" title="Leafblower: A Leakage Attack Against TEE-Based Encrypted Databases">Espiritu et al.</a> and <a href="https://eprint.iacr.org/2024/1308" title="LAMA: Leakage Abuse Attacks Against Microsoft Always Encrypted">Seah et al.</a>.</p>
</aside>

Frequency leakage significantly changes this picture. In <a href="#figure-order-frequency" data-figure-ref>the figure</a>, the ten entries reveal frequency leakage which divides them into groups of 2, 5, and 3. The attacker now knows that the first two records share one hidden value, the next five share another, and the last three share a third. This ordered list of group sizes is the plaintext histogram.

As shown, this histogram allows for significantly more accurate reconstruction.
Those counts also help an attacker guess the values themselves. With order alone, an attack using a public or previously known distribution must infer the group boundaries from that *auxiliary* histogram. If its histogram is stale or comes from a different population, those boundaries can be wrong. However, the adversary has no way of correcting those boundaries and has to take them as the ground truth. With histogram leakage,  the attacker learns _constraints_ on groups of ciphertexts from the target database. They can use these constraints to more accurately "align" its guesses to the real plaintext values.


<figure class="paper-figure" id="figure-order-frequency">
  <div class="paper-figure-viewport">
    {% include blog_figures/order-versus-frequency.html %}
  </div>
  <figcaption><b>Interactive!</b> Order-only leakage requires the adversary to take the auxiliary distribution as ground truth, but with frequency leakage, the adversary can "align" its guesses to the constraints of the leakage. Drag the tops of the auxiliary bars to adjust the estimate for A, B, and C.</figcaption>
</figure>
<script defer src="{{ '/javascripts/figure1-interactive.js' | relative_url }}"></script>

Because of this, claims of order-only leakage for Always Encrypted (and other TEE-based EDBs) are significant: they exclude the frequency information which gives classical inference attacks (like the ones described above) their power. Microsoft even emphasizes this point in later security analyses, with statements like:

> PPE attacks that rely on the static DB [e.g., snapshots] are not applicable to enclave-enabled EDBs which store data strongly-encrypted [e.g., using randomized encryption] ([source](https://vldb.org/cidrdb/2021/integrity-based-attacks-for-encrypted-databases-and-implications.html))

Of course, we will now show a PPE attack against Always Encrypted's randomized encryption scheme which relies solely on a single snapshot of the database.

# The Vulnerability

<aside class="post-aside post-aside--references">
  <p>The uniqueness invariant's ubiquity comes from its advantages—it heavily simplifies the implementation of fine-grained locking needed to support concurrency and meaningfully reduces write amplification (<a href="https://15721.courses.cs.cmu.edu/spring2020/papers/06-oltpindexes1/a16-graefe.pdf" title="A Survey of B-Tree Locking Techniques">Graefe</a>, <a href="https://www.cs.cmu.edu/~dga/15-712/F07/papers/Lehman81.pdf" title="Efficient Locking for Concurrent Operations on B-Trees">Lehman and Yao</a>, <a href="https://db.cs.cmu.edu/papers/2018/mod342-wangA.pdf" title="Building a Bw-Tree Takes More Than Just Buzz Words">Wang et al.</a>).</p>
</aside>

Our attack relies on a subtle detail that we actually saw earlier in <a href="#figure-encrypted-btree" data-figure-ref>the figure</a>.
While databases can contain multiple records with the same indexed value, essentially all practical B<sup>+</sup>-tree storage engines enforce uniqueness of physically stored keys.
Thus, to satisfy the uniqueness invariant in non-unique indexes, databases extend the user-visible key $k$ with a unique _tie-breaker_ component $u$. Then, the B<sup>+</sup>-tree entries are lexicographically sorted by $(k,u)$. Databases can instantiate this tie-breaker in different ways, but the most common way to instantiate it is the record ID associated with each key (as is done in Microsoft SQL Server).

However, in Always Encrypted's B<sup>+</sup>-tree index (and other TEE-hybrid databases), the tie-breakers are _not_ encrypted. They are visible in plaintext in a single snapshot of the index.

Do you see the issue?

The sequence of tie-breakers immediately gives us the following simple frequency recovery attack against the B<sup>+</sup>-tree from <a href="#figure-encrypted-btree" data-figure-ref>the B<sup>+</sup>-tree diagram</a>. We scan the leaves from left to right to get a sequence of tie-breakers, then observe whenever a descent occurs in the tie-breaker sequence:

<figure class="paper-figure" id="figure-growth-rings">
  <div class="paper-figure-viewport">
    {% include blog_figures/record-id-growth-rings.html %}
  </div>
  <figcaption>The dendrochronology vulnerability, visualized. The descents of the tie-breakers / record IDs exactly align with the plaintext key boundaries, even though the plaintext keys themselves are encrypted with randomized encryption.</figcaption>
</figure>

The drops from `15` to `2`, from `14` to `1`, and from `11` to `5` are the growth rings. IDs *cannot* decrease within a group of equal values, because the index sorts those records by ID. Each drop therefore marks a boundary between different plaintext values. Counting entries between the drops gives groups of 3, 6, 2, and 4 records, which exactly matches the plaintext histogram.

Once again, I stress that this doesn't require persistent compromise of the server—only a single snapshot. In fact, the adversary can take this snapshot remotely using a database user account—for example, in Microsoft SQL Server, an attacker who compromises an untrusted database administrator account that doesn't have access to the encryption key can use SQL Server's [Database Console Command API](https://learn.microsoft.com/en-us/sql/t-sql/database-console-commands/database-console-commands?view=sql-server-ver17) to  memory dump  the encrypted index B<sup>+</sup>-tree. It can then perform the above attack directly.

### Limitations

One limitation of the attack is that a boundary does not always produce a drop. If IDs keep increasing across two different values, the attack may merge their groups and recover only an approximation of the histogram. In <a href="#figure-growth-rings-limitation" data-figure-ref>the example below</a>, B and C are inserted in sorted order: all B records have lower IDs than the C records. Their IDs rise from `10` to `11` at the hidden B/C boundary, so the attack sees no descent there.

<figure class="paper-figure" id="figure-growth-rings-limitation">
  <div class="paper-figure-viewport">
    {% include blog_figures/record-id-growth-rings-limitation.html %}
  </div>
  <figcaption>When all instances of B are inserted before the first instance C, the B/C boundary produces no ID descent.</figcaption>
</figure>

I discuss this technicality in more detail in the paper, but it does not affect the attack's performance in experiments where the data is inserted randomly.

# Impact

<aside class="post-aside post-aside--references">
  <p>As part of coordinated disclosure, I also received third-party confirmation from Alibaba that our attack works against <a href="https://www.alibabacloud.com/help/en/rds/apsaradb-rds-for-mysql/always-confidential-database-public-preview/">Alibaba's Always-Confidential</a>.</p>
</aside>

I tested our attack against all TEE-hybrid databases for which I could find  publicly available artifacts, which were:

* [Microsoft SQL Server's Always Encrypted with Secure Enclaves](https://learn.microsoft.com/en-us/sql/relational-databases/security/encryption/always-encrypted-enclaves?view=sql-server-ver17)
* [StealthDB](https://petsymposium.org/popets/2019/popets-2019-0052.php), an academic TEE-hybrid database from 2019
* [HeDB](https://www.usenix.org/conference/osdi23/presentation/li-mingyu), an academic TEE-hybrid database from 2023

The evaluation uses the attack to recover the plaintext histogram and then uses the state-of-the-art "multinomial attack" from <a href="https://www.vldb.org/pvldb/vol11/p1715-bindschaedler.pdf" title="The Tao of Inference in Privacy-Protected Databases">Bindschaedler et al.</a> to perform plaintext inference as described in <a href="#yes-frequency-leakage-matters">Section 3</a>.
As shown in <a href="#figure-recovery-results" data-figure-ref>the figure</a>, the frequency leakage recovered by the dendrochronology attack massively increases the adversary's ability to accuracy guess the plaintext values associated with each ciphertext.

<figure class="paper-figure" id="figure-recovery-results">
  <div class="paper-figure-viewport">
    {% include blog_figures/plaintext-recovery-results.html %}
  </div>
  <figcaption>Exact recovery of inserted records in three public-data experiments. Both attacks use the same auxiliary distribution; Dendrochronology adds the boundaries recovered from snapshots. Values are from Table 2 of the paper.</figcaption>
</figure>

# Strawman: What If We Encrypt the Record IDs?

Hiding the record IDs fixes the direct single-snapshot attack, but it does not necessarily end the story. If an attacker gets snapshots at different times and can recognize the same ciphertext across them, they can tell which snapshot first contained each record. These “birth times” act as stand-ins for the hidden IDs. They preserve insertion order across snapshots, but records inserted between two captures get the same birth time, even if their actual IDs differ.

<figure class="paper-figure" id="figure-birth-times">
  <div class="paper-figure-viewport">
    {% include blog_figures/snapshot-birth-time-smushing.html %}
  </div>
  <figcaption><b>Interactive!</b> With multiple snapshots, the adversary can recover descents—though it depends on when the snapshots were taken. Drag the rows on the right side to change when snapshots were taken and see how fewer snapshots can "smush" several IDs into one timestamp, hiding a boundary.</figcaption>
</figure>
<script defer src="{{ '/javascripts/snapshot-birth-times-interactive.js' | relative_url }}"></script>

At the starting $$\mathsf{T}_3$$, $$\mathsf{T}_6$$, and $$\mathsf{T}_{10}$$ positions, record IDs `8` and `7` first appear in the same snapshot, so their real drop becomes a flat `3` to `3`. The boundary between the second and third plaintext values is lost: their true groups of 3 and 2 records look like one group of 5. The other two descents survive, so the attacker still learns an approximate histogram.

{% comment %}

# When Entire Pages Are Encrypted

The paper also extends the idea to databases that run their *entire* storage engine inside a TEE. Here, individual keys and record IDs are hidden inside encrypted disk pages. My earlier Leafblower attack showed how repeated snapshots of those pages can reveal the order and identity of the B<sup>+</sup>-tree's logical leaves, even without revealing their contents. This extension uses the time each leaf first appears in the snapshots: its *birth time*.

Think of each leaf as a bucket of records. When a bucket fills, the storage engine splits it and creates a new bucket. Later inserts of one value can create a new leaf just before an older leaf containing the next value. In <a href="#figure-leafblower" data-figure-ref>the simplified example below</a>, the five final leaves contain three hidden values and have birth times `(1, 25, 15, 20, 10)` in index order. The drops `25 → 15` and `20 → 10` mark two plaintext boundaries. They divide the leaves into groups of 2, 2, and 1. If each leaf holds roughly five records, the attacker estimates an ordered histogram of `(10, 10, 5)`. The actual counts in this example are `(8, 11, 6)`: the estimate is useful, but it is not exact because boundaries can fall *inside* leaves.

<figure class="paper-figure" id="figure-leafblower">
  <div class="paper-figure-viewport">
    {% include blog_figures/leafblower-bucket-births.html %}
  </div>
  <figcaption>Leafblower's tracked pages reveal birth time descents and approximate group sizes even when entire leaves are encrypted. The shown leaf contents and hollow boundary markers explain the example; the attacker tracks encrypted pages across snapshots. Simplified from <a href="https://eprint.iacr.org/2026/2465.pdf#page=11">Figure 7 of the paper</a>.</figcaption>
</figure>

{% endcomment %}

# Takeaways

I really enjoyed working on this research project, primarily because—in the words of one of the anonymous reviewers—it has this kind of nice "obvious after the fact" flavor to it that makes it really easy to appreciate.

<aside class="post-aside post-aside--references">
  <p>Though I can speculate with <em>some</em> authority since I missed this idea when I was working on my earlier <a href="https://zacharyespiritu.com/papers/leafblower-sp2026.pdf">Leafblower</a> attack, which only recovers order-only leakage against <b>TEE-native</b> databases. In the <a href="https://eprint.iacr.org/2026/2465">dendrochronology</a> paper, I show that the same dendrochronology idea transfers to recover approximate histograms from TEE-native databases, which in turn can sometimes improve the performance of the Leafblower attack.</p>
</aside>

As with any such "obvious"  idea, one should then ask: why has this seemingly simple vulnerability gone unnoticed for many years? (The earliest such database, [TrustedDB](https://dl.acm.org/doi/10.1145/1989323.1989346), appeared as early as 2011.)

While I can only speculate, I think prior analyses of TEE-based EDBs modeled the TEE-based index as a sorted sequence of ciphertexts and abstracted additional practical index metadata—such as tie-breakers—out of the model. This highlights an occupational hazard of designing TEE-based applications: the promise of reusing a plaintext storage engine invites designers to treat the existing engine as a black box, when, in reality, its algorithmic invariants become critical parts of the security boundary (and surprising vectors of leakage). Seemingly benign features that make legacy storage engines practical end up becoming surprising sources of leakage.

With that, I leave you with some broader lessons and takeaways:

* **Index metadata reveals plaintext structure.** A B<sup>+</sup>-tree needs a way to order duplicate keys, and many storage engines use increasing record IDs as tie-breakers. When those IDs remain visible beside encrypted keys, drops in their sorted sequence expose boundaries between plaintext values, even if the TEE behaves correctly.
* **A snapshot attacker can learn more than order.** For affected TEE-hybrid indexes, one point-in-time snapshot can reveal those boundaries without observing live queries or compromising the enclave.
* **Secure co-design with TEEs, whether for databases or other applications, cannot treat existing algorithms as a neutral implementation detail.** Such components
must be carefully
analyzed as part of the security boundary—and, as shown in <a href="#strawman-what-if-we-encrypt-the-record-ids">Section 6</a>,  simple modifications to secure those algorithms could have non-obvious pitfalls too. I expect that as additional TEE-based applications become more mainstream, vulnerabilities like these will arise from natural consequences of the underlying (plaintext) algorithms.

Want to learn more? Check out the full paper, ["Snapshots of TEE-Based Encrypted Databases Leak Plaintext Histograms via Dendrochronology"](https://eprint.iacr.org/2026/2465), for more  formal analysis,  additional case studies, experimental details, and to appreciate TiKZ diagrams I spent too much time working on.

