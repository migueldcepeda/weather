function initialize() {
  var address = (document.getElementById('city'));
  var autocomplete = new google.maps.places.Autocomplete(address);
  autocomplete.setTypes(['geocode']);
  google.maps.event.addListener(autocomplete, 'place_changed', function() {
    var place = autocomplete.getPlace();
    if (!place.geometry) {
        return;
    }

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
    }
  });
}

function codeAddress() {
  geocoder = new google.maps.Geocoder();
  var address = document.getElementById("city").value;
  var lat, lng;
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {

      //alert("Latitude: "+results[0].geometry.location.lat());
      //alert("Longitude: "+results[0].geometry.location.lng());
      lat = results[0].geometry.location.lat();
      lng = results[0].geometry.location.lng();
      getWeather([lat, lng]);
    } else {
      console.log("Geocode was not successful for the following reason: " + status);
      $("#noCity").fadeIn();
    }
  });
}

google.maps.event.addDomListener(window, 'load', initialize);

function getWeather(loc) {
  //console.log("Latitude is " + loc[0]);
  //console.log("Longitude is " + loc[1]);
  //return loc;
  var url = "https://api.darksky.net/forecast/709ab09e9818d5268e3666cc02ca4513/" + loc[0] + "," + loc[1];
    $.ajax({
      type: 'GET',
      url: url,
      dataType: "jsonp",
      success: function(data) {
        if(data !== ""){
          var html = "";
          var currentTime = new Date(data["currently"]["time"] * 1000).toTimeString(); //.split(' ')[0];
          var currentWeather = data["currently"]["summary"];
          var tomorrowWeather = data["daily"]["data"][1]["summary"];
          var weekWeather = data["daily"]["summary"];

          html = "<div><strong>Current Time: </strong>" + currentTime + "</div>";
          html += "<div><strong>Current Weather: </strong>" + currentWeather + "</div>";
          html += "<div><strong>Tomorrow's weather forecast: </strong>" + tomorrowWeather + "</div>";
          html += "<div><strong>This week's forecast: </strong>" + weekWeather + "</div>";
    
          $("#success").html(html).fadeIn();
          
        } else {
          $("#fail").fadeIn();
        }          
      }
    });
}

$("#findMyWeather").click(function(event) {
    event.preventDefault();
    $(".alert").hide();
    codeAddress();
});