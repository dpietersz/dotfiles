#!/bin/bash
# Increase volume and play feedback sound

# Increase volume by 5%
wpctl set-volume @DEFAULT_AUDIO_SINK@ 0.05+

# Play volume change sound
canberra-gtk-play -i audio-volume-change &
