---
layout: post
title:  "Easy Audio in iOS: Using OALSimpleAudio in Swift"
short_title: "OALSimpleAudio: Easy Audio in iOS"
image_path: /images/design-instimize.png
tagline: There’s numerous ways to play audio in your iOS apps, but the simplest way to do so is using the OALSimpleAudio class from the extremely helpful ObjectAL open-source library.
card_color: "blue"
---

There’s numerous ways to play audio in your iOS apps, but the simplest way to do so is using the `OALSimpleAudio` class that you can download from the extremely helpful [ObjectAL open-source library][OALSimpleAudio-Github]. It has its advantages and disadvantages, but ultimately, if you're just looking to play audio without much customization or control, this is probably what you're looking for.

### OALSimpleAudio: The Simple Way To Play Audio

`OALSimpleAudio` is just that: simple. In exchange for giving up a bit of control over your audio files, `OALSimpleAudio` is much, much simpler to use in comparison to Apple's standard `AVAudioPlayer` if you’re just looking to play a little jingle or effect somewhere in your app or some background music in your game.

You'll first need to **download and import** the `OALSimpleAudio` interface into your project. You can download it [here][OALSimpleAudio-Github].

`OALSimpleAudio` works as a singleton, so in order to be able to use any of the methods provided, you’ll need to access it from the `sharedInstance()`:

{% highlight swift %}
let audio = OALSimpleAudio.sharedInstance()
{% endhighlight %}

*(Note: the above line of code isn’t required, though it makes your code much easier to read in the long run because you won’t have the same message of `OALSimpleAudio.sharedInstance()` repeating throughout your code.)*

Now that you’ve accessed the singleton, let’s play a song! Feel free to take any .mp3 or .wav file and drop it somewhere into your project (`OALSimpleAudio` only supports these two file types). The beauty of `OALSimpleAudio` is that it can find your audio files without any extra text parsing code necessary.

`OALSimpleAudio` has two audio playing types for you to choose from: **background audio** and **effect audio**. We’ll go over the differences in more detail below, but it really just comes down to whether or not you’re able to play more than one sound at the same time.

Let’s talk about **background audio** first. I want to play some trap music in the background of the game I’m working on, so I have a file named “superAwesomeTrapSong.mp3”. To play this, all I need to do is run the following code:

{% highlight swift %}
let audio = OALSimpleAudio.sharedInstance()

func playTrapMusic() {
    audio.playBg("superAwesomeTrapSong.mp3", loop: false)
}
{% endhighlight %}

Whenever `playTrapMusic()` is called, you’ll hear the “superAwesomeTrapSong.mp3” playing as background audio. Note the loop parameter: setting it to true will have the song automatically loop back to the beginning of the audio file.

If you want to **stop** the background music, you can run:

{% highlight swift %}
audio.stopBg()
{% endhighlight %}

This will stop the background music playback and automatically rewind to the beginning of the song. 

If you’re just looking to **pause** the song, you can run this code:

{% highlight swift %}
audio.bgPaused = true
{% endhighlight %}

You can continue playing the song from the point where it was paused by setting `bgPaused` to false.

Now, whenever you load an audio file for the first time, you’ll observe a very short but noticeable delay that freezes your application for a moment. In some cases it might not matter too much, but if you wish to avoid this problem, you can **preload** your audio file by running the following line of code:

{% highlight swift %}
func preloadTrapMusic() {
    audio.preloadBg("superAwesomeTrapSong.mp3")
}
{% endhighlight %}

This will load the music file in a state where it can be immediately used. You can run `audio.playBg(…)` in the same exact way as above and it will work the same, just without the delay.

Now’s a good point to note the main difference between **background audio** and **effect audio** in `OALSimpleAudio`: only one background music file may be played and/or preloaded at a time. This means that if you preload another background song while another piece of background music is playing, the music currently playing will stop.

So, let’s talk about **effect audio** now. To fit my trap song, I have a "evenMoreAwesomeBeatDrop.wav" file that I want to play during the song. To play this, I can run:

{% highlight swift %}
func dropTheBeatEffect() {
    audio.playEffect("evenMoreAwesomeBeatDrop.wav")
}
{% endhighlight %}

*(Note: Effect audio **does** have a `loop` parameter, if you wish to use that.)*

There's no limit to how long an effect audio file can be played for, but under most circumstances you should limit the length of your effects to under a few seconds, because there's no way to *individually* stop an effect sound.

However, if you wish to **stop all effects** that are playing currently, you can run:

{% highlight swift %}
func stopAllEffects() {
    audio.stopAllEffects()
}
{% endhighlight %}

And if you really want to **stop everything, background music included**, you can call:

{% highlight swift %}
func bringOnTheSilence() {
    audio.stopEverything()
}
{% endhighlight %}

There's a bit more functionality that you can achieve with `OALSimpleAudio`, such as modifying the volume, pitch, or pan (left/right) of an audio file, but, if possible, I would highly recommend editing your audio files beforehand because the parameters for doing so with `OALSimpleAudio` are very clunky and require a bit of trial and error to use—and if you really need to do it from code, you should probably use `AVAudioPlayer` instead. Still, if you're interested in doing that via `OALSimpleAudio`, you can check out those features in [the provided documentation][OALSimpleAudio-Documentation].

[OALSimpleAudio-Github]: https://github.com/kstenerud/ObjectAL-for-iPhone
[OALSimpleAudio-Documentation]: http://kstenerud.github.io/ObjectAL-for-iPhone/documentation/interface_o_a_l_simple_audio.html
