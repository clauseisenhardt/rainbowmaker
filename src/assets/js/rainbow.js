// Globals
var image;
function upload() {
  var fileIn = document.getElementById("F1");

  var c1 = document.getElementById("can1");
  image = new SimpleImage(fileIn);

  image.drawTo(c1);
}

function doRainbow(imageData) {
  console.log("Rainbow: begin");
  image = new SimpleImage(imageData);
  console.log("Rainbow: image");
  newImage = new SimpleImage(image.getWidth(), image.getHeight());
  console.log("Rainbow: newImage");
  var cnt = 0;
  for (var pix of image.values()){
    var avg = (pix.getRed() + pix.getGreen() + pix.getBlue())/3;
    var newPix = newImage.getPixel(pix.getX(),pix.getY());
    // Red
    if (pix.getY() < (image.getHeight()/7 ) ){
      if (avg < 128){
        newPix.setRed(avg*2);
        newPix.setGreen(0);
        newPix.setBlue(0);
      }
      else{
        newPix.setRed(255);
        newPix.setGreen(avg*2-255);
        newPix.setBlue(avg*2-255);
      }
    }
    // Orange
    else if (pix.getY() < (2*image.getHeight()/7 ) ){
      if (avg < 128){
        newPix.setRed(avg*2);
        newPix.setGreen(avg*0.8);
        newPix.setBlue(0);
      }
      else{
        newPix.setRed(255);
        newPix.setGreen(avg*1.2-51);
        newPix.setBlue(avg*2-255);
      }
    }
    // Yellow
    else if (pix.getY() < (3*image.getHeight()/7 ) ){
      if (avg < 128){
        newPix.setRed(avg*2);
        newPix.setGreen(avg*2);
        newPix.setBlue(0);
      }
      else{
        newPix.setRed(255);
        newPix.setGreen(255);
        newPix.setBlue(avg*2-255);
      }
    }
    // Green
    else if (pix.getY() < (4*image.getHeight()/7 ) ){
      if (avg < 128){
        newPix.setRed(0);
        newPix.setGreen(avg*2);
        newPix.setBlue(0);
      }
      else{
        newPix.setRed(avg*2-255);
        newPix.setGreen(255);
        newPix.setBlue(avg*2-255);
      }
    }
    // Blue
    else if (pix.getY() < (5*image.getHeight()/7 ) ){
      if (avg < 128){
        newPix.setRed(0);
        newPix.setGreen(0);
        newPix.setBlue(avg*2);
      }
      else{
        newPix.setRed(avg*2-255);
        newPix.setGreen(avg*2-255);
        newPix.setBlue(255);
      }
    }
    // Indigo
    else if (pix.getY() < (6*image.getHeight()/7 ) ){
      if (avg < 128){
        newPix.setRed(avg*0.8);
        newPix.setGreen(0);
        newPix.setBlue(avg*2);
      }
      else{
        newPix.setRed(avg*1.2-51);
        newPix.setGreen(avg*2-255);
        newPix.setBlue(255);
      }
    }
    // Violet
    else {
      if (avg < 128){
        newPix.setRed(avg*1.6);
        newPix.setGreen(0);
        newPix.setBlue(avg*1.6);
      }
      else{
        newPix.setRed(avg*0.4+153);
        newPix.setGreen(avg*2-255);
        newPix.setBlue(avg*0.4+153);
      }
    }

    cnt = cnt + 1;
    newImage.setPixel(pix.getX(),pix.getY(),newPix);
  }
  console.log("Rainbow: Loop End: " + cnt.toString());
  //var convImage = document.getElementById("ConvImageCanv");
  var convImage = document.createElement("canvas");
  newImage.drawTo(convImage);
  var dataURL = convImage.toDataURL("image/png");
  console.log("Rainbow:End");
  return dataURL;
}

function Determinant( a, b, c ) {
  var D = b*b - 4*(a*c);
  return D;
}

function CirclePoint( X, x0, y0, r ) {
  var a = 1;
  var b = -2*y0;
  var K = x0*x0 + y0*y0 - r*r;
  //console.log("K=" + K);
  
  var Y = X;
  
  var i = 0;
  for (i = 0; i < X.length; i++ ) {
    var x = X[i];
    var c = x*x - 2*x0*x + K;
    var D = Determinant(a, b, c);
    //console.log("D=" + D);
    var y = (-b + Math.sqrt(D)) / 2*a;
    Y[i] = y;
    //console.log("(x,y): (" + x + "," + y + ")");
  }
    
  return Y;
}

function RainbowPoints( width, heigth, radius, thickness=5) {
  var x0=width/2;
  var y0=heigth - radius - 5*thickness - thickness/2;
  var X = [];
  var i;
  for (i=0; i<=width;i++) {
    X[i] = i;
  }
  
  var Y = CirclePoint(X, x0, y0, radius);
  
  return Y;
}

function FlipPoints(points, height) {
  //console.log("FlipPoints: " + points.length);
  var i;
  for (i=0; i<points.length; i++) {
    //console.log("før p(" + i +")=" + points[i]);
    points[i] = height - points[i];
    //console.log("eft p(" + i +")=" + points[i]);
  }
}

function doRealRainbow() {
  var c3 = document.getElementById("can3");
  var width = image.getWidth();
  var height = image.getHeight();
  var thickness = height/12;
  
  newImage = new SimpleImage(width, height);
  
  var X = [];
  var i;
  for (i=0;i<width;i++) {
    X[i] = i;
  }
  //var Y =  CirclePoint( X, 50, 0, 50 );
  //console.log("(x,y): (" + X[1] + "," + Y[1] + ")");
  var Y = RainbowPoints(width, height, width*1.2, thickness*0);
  console.log("(x,y): (" + X[10] + "," + Y[10] + ")");
  FlipPoints(Y, height);
  console.log("(x,y): (" + X[10] + "," + Y[10] + ")");
  
    
  var C=["c","b","g","y","r"];
  
   var cnt = 0;
  for (var pix of image.values()){
    var avg = (pix.getRed() + pix.getGreen() + pix.getBlue())/3;
    var newPix = newImage.getPixel(pix.getX(),pix.getY());
    var x = X[pix.getX()];
    var y = Y[pix.getX()];
    // Red
    if (pix.getY() > y && pix.getY() < (y + thickness) ){
      if (avg < 128){
        newPix.setRed(avg*2);
        newPix.setGreen(0);
        newPix.setBlue(0);
      }
      else{
        newPix.setRed(255);
        newPix.setGreen(avg*2-255);
        newPix.setBlue(avg*2-255);
      }
    }
    // Orange
    else if (pix.getY() > (y + thickness) && pix.getY() < (y + 2*thickness) ){
      if (avg < 128){
        newPix.setRed(avg*2);
        newPix.setGreen(avg*0.8);
        newPix.setBlue(0);
      }
      else{
        newPix.setRed(255);
        newPix.setGreen(avg*1.2-51);
        newPix.setBlue(avg*2-255);
      }
    }
    // Yellow
     else if (pix.getY() > (y + 2*thickness) && pix.getY() < (y + 3*thickness) ){
      if (avg < 128){
        newPix.setRed(avg*2);
        newPix.setGreen(avg*2);
        newPix.setBlue(0);
      }
      else{
        newPix.setRed(255);
        newPix.setGreen(255);
        newPix.setBlue(avg*2-255);
      }
    }
    // Green
    else if (pix.getY() > (y + 3*thickness) && pix.getY() < (y + 4*thickness) ){
      if (avg < 128){
        newPix.setRed(0);
        newPix.setGreen(avg*2);
        newPix.setBlue(0);
      }
      else{
        newPix.setRed(avg*2-255);
        newPix.setGreen(255);
        newPix.setBlue(avg*2-255);
      }
    }
    // Blue
    else if (pix.getY() > (y + 4*thickness) && pix.getY() < (y + 5*thickness) ){
      if (avg < 128){
        newPix.setRed(0);
        newPix.setGreen(0);
        newPix.setBlue(avg*2);
      }
      else{
        newPix.setRed(avg*2-255);
        newPix.setGreen(avg*2-255);
        newPix.setBlue(255);
      }
    }
    // Indigo
    else if (pix.getY() > (y + 5*thickness) && pix.getY() < (y + 6*thickness) ){
      if (avg < 128){
        newPix.setRed(avg*0.8);
        newPix.setGreen(0);
        newPix.setBlue(avg*2);
      }
      else{
        newPix.setRed(avg*1.2-51);
        newPix.setGreen(avg*2-255);
        newPix.setBlue(255);
      }
    }
    // Violet
    else if (pix.getY() > (y + 6*thickness) && pix.getY() < (y + 7*thickness) ){
      if (avg < 128){
        newPix.setRed(avg*1.6);
        newPix.setGreen(0);
        newPix.setBlue(avg*1.6);
      }
      else{
        newPix.setRed(avg*0.4+153);
        newPix.setGreen(avg*2-255);
        newPix.setBlue(avg*0.4+153);
      }
    }
    else {
      newPix = pix;
    }
    cnt = cnt + 1;
    newImage.setPixel(pix.getX(),pix.getY(),newPix);
  }
  console.log("doRealRainbow: Loop End: " + cnt.toString());
  //var convImage = document.getElementById("ConvImageCanv");
  var convImage = document.createElement("canvas");
  newImage.drawTo(convImage);
  var dataURL = convImage.toDataURL("image/png");
  console.log("doRealRainbow:End");
  return dataURL;
}
