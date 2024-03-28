AFRAME.registerComponent("create-button",{
    init:function(){
        var b1=document.createElement("button")
        b1.innerHTML="RATE DISH"
        b1.setAttribute("class", "btn btn-danger")
        b1.setAttribute("id", "rating-button")

        var b2=document.createElement("button")
        b2.innerHTML="ORDER NOW"
        b2.setAttribute("class", "btn btn-warning")
        b2.setAttribute("id", "order-button")

        var ButtonDiv= document.getElementById("button-div")
        ButtonDiv.appendChild(b1)
        ButtonDiv.appendChild(b2)
    }
})