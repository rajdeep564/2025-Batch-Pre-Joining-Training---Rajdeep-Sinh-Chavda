// $("p").hide();

$(document).ready(function () {
    $('#button').click(function (){
        $("p").hide();
    })

    // $('#button2').dblclick(function (){
    //     $("p").show();
    // })

    $('#button').mouseenter(function (){
        console.log("mouse enter to button 1");
    })
    
});

// $(document).ready(function () {
//     $('#button2').click(function (){
//         $("p").show();
//     })
// });

