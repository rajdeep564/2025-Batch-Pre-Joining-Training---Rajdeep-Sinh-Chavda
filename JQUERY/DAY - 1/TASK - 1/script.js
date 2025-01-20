document.getElementById("calculateButton").addEventListener("click", function (e) {

    e.preventDefault();

    const t1 = document.getElementById("input1").value;

    const t2 = document.getElementById("input2").value;

    const t3 = document.getElementById("input3").value;




    if (isNaN(t1) || isNaN(t2) || isNaN(t3) || t1 === "" || t2 === "" || t3 === "") {

        document.getElementById("input4").value = "Inputs T1, T2, T3 should only contain numbers.";

    } else {

        if (t1 <= 0 || t1 > 9 || t2 <= 0 || t2 > 9 || t3 <= 0 || t3 > 9) {

            document.getElementById("input4").value = "Please Enter Numbers Between 1 - 9";

        }

        else {

            const mid = parseFloat(t1) + parseFloat(t2);

            const result = (parseFloat(t1) + parseFloat(t2)) + "|" + t3 + "|" + mid + t3;

            document.getElementById("input4").value = result;

        }



    }

});


// with jquery

// $(document).ready(function () {

//     $("#calculateButton").click(function (e) {

//         e.preventDefault();


//         const t1 = $("#input1").val();

//         const t2 = $("#input2").val();

//         const t3 = $("#input3").val();


//         if (isNaN(t1) || isNaN(t2) || isNaN(t3) || t1 === "" || t2 === "" || t3 === "") {

//             $("#input4").val("Inputs T1, T2, T3 should only contain numbers.");

//         } else {

//             if (t1 < 0 || t1 > 9 || t2 < 0 || t2 > 9 || t3 < 0 || t3 > 9) {

//                 $("#input4").val("Please Enter Numbers Between 0 - 9");

//             } else {

//                 const mid = parseFloat(t1) + parseFloat(t2);

//                 const result = (parseFloat(t1) + parseFloat(t2)) + "|" + t3 + "|" + mid + t3;

//                 $("#input4").val(result);

//             }

//         }

//     });

// });

