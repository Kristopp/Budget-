
// Module 1(Controller Module)

var budgetController = (function() { 

var x = 23;


var add = function(a) { 
    return x + a;
} 
return { 
    publicTest: function(b) { 
        return (add(b));
    }
}

})();

// Module 2(Controller Module)

var UIController = (function() {  
    
    
    var o = 96;

var bee = function(a) { 
    return o + a;
} 
return { 
    publicTest: function(x) { 
        return(bee(x));
    }
}



    // Some code 


}) ();   

// Module 3 (Controller Module to connect other 2) 

var controller = (function(budgetCont, UICont) { 
   
    var f = budgetCont.publicTest(5);

    var x = UIController.publicTest(69);
   return { 
       anotherPublic: function () { 
           console.log(f, x);
       }
   }

}) (budgetController, UIController);