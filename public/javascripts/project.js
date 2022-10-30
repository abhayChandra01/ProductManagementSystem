$(document).ready(function()
{


  function fillCategory(category)
  {
    $('#ptype').empty()
    $('#ptype').append($('<option>').text("-Categories-"))

    $.getJSON('/products/getproducttype',{'category':category},function(data)
    {

      $.each(data,function(index,item)
      {
        $('#ptype').append($('<option>').text(item.typename).val(item.typeid))



      })

    })
  }
  
  $('#food').change(function()
  {

   fillCategory("Food")
   $('#gst').val("5") 



  })
  
  $('#electronics').change(function()
  {

    fillCategory("Electronics")
    $('#gst').val("18")



  })
  
  $('#ptype').change(function()
  {

    $('#units').empty()
    $('#units').append($('<option>').text("-Units-"))

    $.getJSON('/products/getunits',{'typeid':$('#ptype').val()},function(data)
    {

      $.each(data,function(index,item)
      {
        $('#units').append($('<option>').text(item.unitvalue).val(item.unitid))



      })

    })
  })   

  $('#inr').change(function()
  {

    $.getJSON('/products/getprice',{'unitid':$('#units').val()},function(data)
    {

      //alert(JSON.stringify(data))

      $('#price').val(data[0].price)



    })
 
 
  })
   
  $('#usd').change(function()
  {

    $.getJSON('/products/getprice',{'unitid':$('#units').val()},function(data)
    {
      
      $('#price').val((data[0].price/74.8).toFixed(2))



    })
 
 
  })
   
  $('#offer').change(function()
  {
   
    //alert($('#inr').prop('checked'))

   
    $('#offerrate').val($('#offer').val())

   

  })




})