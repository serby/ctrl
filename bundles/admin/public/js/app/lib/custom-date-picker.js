module.exports = function () {

  //
  // PIKADAY DATEPICKER
  //
  $('.datepicker input').each(function(){
    window.Pikaday({
        field: this
      , firstDay: 1
    })
  })

}