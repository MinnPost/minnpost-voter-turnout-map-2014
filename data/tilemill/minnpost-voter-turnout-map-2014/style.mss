Map {
  background-color: transparent;
}

@color1: #bfdcd9;
@color2: #7cb8c5;
@color3: #4691ba;
@color4: #3c64a7;
@color5: #55307e;

#county-turnout {
  line-color: #787878;
  line-width: 0.5;
  polygon-opacity: 0.65;
  polygon-fill: @color1;
}

#county-turnout[t2014 >= 0.45] { polygon-fill: @color2; }
#county-turnout[t2014 >= 0.50] { polygon-fill: @color3; }
#county-turnout[t2014 >= 0.55] { polygon-fill: @color4; }
#county-turnout[t2014 >= 0.60] { polygon-fill: @color5; }

