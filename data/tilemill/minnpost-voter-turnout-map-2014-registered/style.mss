Map {
  background-color: transparent;
}

@color1: #d6e6ce;
@color2: #c4c693;
@color3: #c2a25c;
@color4: #c67736;
@color5: #c83d2d;

#county-turnout {
  line-color: #787878;
  line-width: 0.5;
  polygon-opacity: 0.65;
  polygon-fill: @color1;
}

#county-turnout[vPerR >= 0.60] { polygon-fill: @color2; }
#county-turnout[vPerR >= 0.65] { polygon-fill: @color3; }
#county-turnout[vPerR >= 0.70] { polygon-fill: @color4; }
#county-turnout[vPerR >= 0.75] { polygon-fill: @color5; }

