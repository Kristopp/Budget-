
// Module 1(Controller Module)

var budgetController = (function() { 

    // Ma kastuan Constructor Objekt

    var Expenses = function (id, description , value) { 
        
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;

    };
    Expenses.prototype.calcPercentage = function(totalIncome) { 
        if (totalIncome > 0) { 
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else { 
            this.percentage = -1;
        }
    };

    Expenses.prototype.getPercentage = function() { 
        return this.percentage;
    };
    var Income = function (id, description, value) { 
        
        this.id = id;
        this.description = description;
        this.value = value;
    };

       // Data struktuur. 

       var calculateTotal = function(type) { 
           var sum = 0;
           data.allItems[type].forEach(function(cur){ 
               sum += cur.value;
           });
           data.totals[type] = sum;

       };

       var data = { 
          allItems: { 
              exp: [],
              inc: []
          },
          totals: { 
              exp: 0,
              inc: 0
          },
          budget: 0,
          percentage: -1
       };

       return { 
           addItem: function(type, des, val) { 
               var newItem, ID;

               ID = 0;



               //loob uue id nr uuele objecktile hetkel on uus id 0 -1 nii
               // ma pean tegema nii et uus id oleks 0 ja sealt + 1 ja siis - 1'

            if (data.allItems[type].length > 0) { 

                ID = data.allItems[type][data.allItems[type].length - 1].id + 1; 
                   
               } else { 
                ID = 0;
               }
               //Loob uue objeckti kas exp v6i inc.

               if(type === 'exp') { 
                newItem = new Expenses(ID, des , val);
               } else if (type === 'inc') { 
                newItem = new Income(ID, des , val);
               } 
               // Paneb uue itemi minu data struktuuri
               data.allItems[type].push(newItem);
                              //returnib  newItem
               return newItem;
            }, 

            deleteItem: function(type, id) {
                var ids, index;
                
                ids = data.allItems[type].map(function(current) {
                    return current.id;
                });
     
                index = ids.indexOf(id);
     
                if (index !== -1) {
                    data.allItems[type].splice(index, 1);
                }
            },
            calculateBudget: function() { 
                // calculate total income and expenses
                calculateTotal('exp');
                calculateTotal('inc');

                // calculate the budget: income - expenses 
                data.budget = data.totals.inc - data.totals.exp;
                // calculate the precentage of income
                if(data.totals.inc > 0) { 
                    data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);

                } else { 
                    percentage = -1;
                }
                          
            }, 
            calculatePercentages: function() { 
                data.allItems.exp.forEach(function(cur) { 
                    cur.calcPercentage(data.totals.inc);
                });

            },
            getPercentages: function() { 
                var allPerc = data.allItems.exp.map(function(cur) { 
                    return cur.getPercentage();
                });
                return allPerc;
            },
            getBudget: function() { 
                return { 
                    budget: data.budget,
                    totalInc: data.totals.inc,
                    totalExp: data.totals.exp,
                    percentage: data.percentage,


                }
            },
            

            testing: function() { 
                console.log(data);
            },

           
       };
  

})();


// Module 2(Controller Module)

var UIController = (function() {  

    // Private method for DOM strings

    var DOMstrings = { 
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer:'.income__list',
        expensesContainer:'.expenses__list',
        budgetLabel: '.budget__value',
        incLable: '.budget__income--value',
        expLable: '.budget__expenses--value',
        percentageLable: '.budget__expenses--percentage',
        container: '.container',
        expensesLable: '.item__percentage',
        dateLable: '.budget__title--month'
    }; 
    var formatnumber = function(num, type) { 
        /* type + v6i type - 
        ja n2itada koma kohtasi 1000 -> 1000.00 
        */ 
       var numSplit, int, dec;

       num = Math.abs(num);
       num = num.toFixed(2);

       numSplit = num.split('.');
       int = numSplit[0];
       if (int.length > 3) { 
           int = int.substr(0 ,int.length - 3) + ',' + int.substr(int.length - 3, 3);
       }

       dec = numSplit[1];

       return (type === 'exp' ? '-' : '+') + '' + int + '.' + dec;

    }; 
    var nodeListForEach = function(list, callback) { 
        for(var i = 0; i < list.length; i++) { 
            callback(list[i], i);
        }
    };

   
    

    return  { 

        getinput: function() { 
            return { 

                // Method HTML v22rtuste jaoks

             type: document.querySelector(DOMstrings.inputType).value, // V22rtus v]ib olla kas inc or exp
             description: document.querySelector(DOMstrings.inputDescription).value,
             value: parseFloat(document.querySelector(DOMstrings.inputValue).value),

            };

        },

        addListItem: function (obj, type) { 
            var html;
                 //Loon HTML ajustise stringi 
                 if(type === 'inc') { 
                     element = DOMstrings.incomeContainer;
                     html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

                 } else if(type === 'exp') { 
                     element = DOMstrings.expensesContainer;
                     html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

                 }
                        //panen data ajutise stringi
                        newHtml = html.replace('%id%', obj.id).replace('%description%', obj.description).replace('%value%', formatnumber(obj.value, type));
                 document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        }, 
        deleteListItem: function(selectorID) { 
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);

        },
        clearFields: function() { 
            var fields,fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + 
            DOMstrings.inputValue); 

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array){ 
                current.value = '';

            });

            fieldsArr[0].focus();
        }, 

        displayBudget: function(obj){ 
            var type;
            obj.budget > 0 ? type = 'exp' : type = 'inc'; 

            document.querySelector(DOMstrings.budgetLabel).textContent = formatnumber(obj.budget, type);
            document.querySelector(DOMstrings.incLable).textContent = formatnumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expLable).textContent = formatnumber(obj.totalExp, 'exp');

            if(obj.percentage > 0) { 
                document.querySelector(DOMstrings.percentageLable).textContent = obj.percentage;
            } else { 
                document.querySelector(DOMstrings.percentageLable).textContent = '___';
            }
            
        },

        displayPercentages: function(percentages) { 
            var fields = document.querySelectorAll(DOMstrings.expensesLable);

            
            nodeListForEach(fields, function(current, index) { 
                if (percentages[index] > 0) { 
                    current.textContent= percentages[index] + '%';
                } else { 
                    current.textContent = '---';
                }

            }); 

            
        }, 

        changedColor: function() { 
            var fields = document.querySelectorAll( 
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' + 
                DOMstrings.inputValue);

                nodeListForEach(fields, function(cur) { 
                    cur.classList.toggle('red-focus');
                });

                document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
            

        },

        displayDate: function() { 
            var now, year;
            var now = new Date();

            month = now.getMonth() + 1;

            year = now.getFullYear();
           
            document.querySelector(DOMstrings.dateLable).textContent = month + '.' +  year;
        },

        
      
    
        getDOMstrings: function() { 
           return DOMstrings;
        }
    };

})();   


// Module 3 (Controller Module to connect other 2) 

var controller = (function(budgetController, UICont) {  

    var setUpEventListeners = function() { 
        
        
        var DOM = UICont.getDOMstrings();
        
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrAddItem);
        document.addEventListener('keypress', function(event) { 
        
            if ( event.keyCode === 13 || event.witch === 13) { 

            ctrAddItem();
            
        }

    }); 
    document.querySelector(DOM.container).addEventListener('click', ctrDeleteItem);

    document.querySelector(DOM.inputType).addEventListener('change', UIController.changedColor);

    }; 
    var updateBudget = function() { 
        // 1.Calculate the budget
        budgetController.calculateBudget();

        // 2.return the budget

        var budget = budgetController.getBudget();

        console.log(budget);

        // 3.Display the budget on UI
        UIController.displayBudget(budget);
    };

    var updatePercentages = function() { 
        // 1.calculate percentages
        budgetController.calculatePercentages();

        //2.Read percentages from the budget

        var percentages = budgetController.getPercentages();

        //3. Update the UI with the new percentages
        UIController.displayPercentages(percentages);
    }

    var ctrAddItem = function() { 
        var input, newItem;

     // 1.Get field input data 
    var input = UICont.getinput();  

    if(input.description !== '' && !isNaN(input.value) && input.value > 0) { 
           
    //  2.add item to budgetController
    var  newItem = budgetController.addItem(input.type, input.description, input.value);
    //  3.Add or remove items from UI
     UIController.addListItem(newItem, input.type);
     UIController.clearFields();
    //  4 Calculate the budget 
    updateBudget();
    //  5.Display the budget on the UI
    //  6.Calculate percentages
    updatePercentages();
    

    }
 
    };

    var ctrDeleteItem = function(event) { 
        var itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; 
        
        if (itemID) { 
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1.delete the item from the data structure

            budgetController.deleteItem(type, ID);
            //2. delete the item from the ui
            UIController.deleteListItem(itemID);

            //3. update and show the new budget 
            updateBudget();
            //4.New percentages
            updatePercentages();
        }
    };

    return { 
        init: function() {            
            setUpEventListeners();
            UIController.displayDate();
            UIController.displayBudget( { 
                    budget: 0,
                    totalInc: 0,
                    totalExp: 0,
                    percentage: -1,
            });
            setUpEventListeners();
        }
    };
  
   }) (budgetController , UIController);

controller.init();