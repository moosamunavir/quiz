/***********************************************
 *              quiz controller
 * ********************************************/
 
var quizControler = (function(){

        //****************** QUESTION CONSTUCTOR*********************** */

        function Question(id,questionText,options,correctAnswer){
                this.id = id ;
                this.questionText = questionText ; 
                this.options = options ; 
                this.correctAnswer = correctAnswer ;

        }

        var questionLocalStorage = {
                setquestionCollection: function(newcollection){
                        localStorage.setItem("questionCollection",JSON.stringify(newcollection));
                },
                getQuestionCollection: function(){
                        return JSON.parse(localStorage.getItem("questionCollection"));
                },
                removequestionCollection : function(){
                        localStorage.removeItem("questionCollection");
                }
        };

        if(questionLocalStorage.getQuestionCollection() === null){
                questionLocalStorage.setquestionCollection([]);
        }

        var quizProgress = {
                questionIndex: 0 
        };

//**************************** PERSON CONSTRUCTOR ******************/

        function Person(id,firstname,lastname,score) {               
                this.id = id;
                this.firstname = firstname;
                this.lastname = lastname;
                this.score = score;
        }

        var currPersonData = {
                fullname: [],
                score: 0
        };

        var adminFullName = ["moosa","munavir"];

        var personLocalStorage = {
                setPersonData: function(newPersonData) {
                        localStorage.setItem("personData",JSON.stringify(newPersonData));
                },
                getPersonData : function(){
                        return JSON.parse(localStorage.getItem("personData"));
                },
                removePersonData : function() {
                        localStorage.removeItem("personData");
                },
        };

        if(personLocalStorage.getPersonData() === null) {
                personLocalStorage.setPersonData([]);
        }
        
              return {

                getQuizProgress: quizProgress,

                getQuestionLocalStorage: questionLocalStorage,

                addQuestionOnLocalStorage: function(newQuestText,opts){
                        var optionsArr,
                                corrAns,
                                qustionId ,
                                newQuestion ,
                                getStoredQuests ,
                                isChecked;

                        if(questionLocalStorage.getQuestionCollection() === null){
                                questionLocalStorage.setquestionCollection([]);
                        }

                        optionsArr = [];

                        isChecked = false;

                        for(var i =0 ; i < opts.length; i++){
                                if(opts[i].value !==""){
                                        optionsArr.push(opts[i].value);
                                }

                                if(opts[i].previousElementSibling.checked && opts[i].value !== "") {
                                        corrAns=opts[i].value;
                                        isChecked = true;
                                }
                        }
        

                        // [{ id: 0}{ id : 1}]

                         if(questionLocalStorage.getQuestionCollection().length > 0) {
                                qustionId = questionLocalStorage.getQuestionCollection()[questionLocalStorage.getQuestionCollection().length -1].id + 1;
                         } else {
                                qustionId = 0;
                         }

                        if(newQuestText.value !== ""){

                                if(optionsArr.length > 1) {
                                        if(isChecked) {

                                        newQuestion = new Question(
                                                qustionId, 
                                                newQuestText.value, 
                                                optionsArr, 
                                                corrAns
                                        );

                                        getStoredQuests = questionLocalStorage.getQuestionCollection();

                                        getStoredQuests.push(newQuestion);

                                        questionLocalStorage.setquestionCollection(getStoredQuests);

                                        newQuestText.value = "";

                                        for(var x = 0 ; x< opts.length; x++) {
                                                opts[x].value = "" ;
                                                opts[x].previousElementSibling.checked = false;
                                        }

                                        console.log(questionLocalStorage.getQuestionCollection());

                                        return true;
                                    } else {
                                        alert('you missed to check correct Answer , or you checked answer without value');
                                        return false ;
                                    }
                                } else {
                                        alert('you must insert atleast 2 options');
                                return false ;
                                }
                        } else {
                                alert('please insert Question');
                        return false ;
                        }
                },

                checkAnswer: function(ans) {

                        if(questionLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnswer === ans.textContent) {

                                currPersonData.score ++ ;

                                return true;
                        } else {
                                return false;
                        }

                },

                isFinished: function() {

                        return  (quizProgress.questionIndex + 1 === questionLocalStorage.getQuestionCollection().length);
                },

                addPerson: function() {
                        var newPerson, personId, personData;
                        

                        if(personLocalStorage.getPersonData().length > 0) {

                                personId = personLocalStorage.getPersonData()[personLocalStorage.getPersonData().length - 1].id + 1;
                        } else {
                                personId = 0;
                        }

                        newPerson = new Person(
                                personId,
                                currPersonData.fullname[0],
                                currPersonData.fullname[1], 
                                currPersonData.score
                        );

                        personData = personLocalStorage.getPersonData();

                        personData.push(newPerson);
                        
                        personLocalStorage.setPersonData(personData);

                        console.log(newPerson);
                },

                getCurrPersonData: currPersonData,

                getAdminFullName: adminFullName,

                getpersonLocalStorage: personLocalStorage
        };
})();

/***********************************************
 *              UI controll
 * ********************************************/
var UIController = (function(){
        
        var domItems = {
        /************admin panel elements********* */
        adminPanelSection: document.querySelector(".admin-panel-container"),
        qustInsertBtn: document.getElementById("question-insert-btn"),
        newQuestionText: document.getElementById("new-question-text"),
        adminOptions: document.querySelectorAll(".admin-option"),
        adminOptionsContainer: document.querySelector(".admin-options-container"),
        insertedQuestsWrapper: document.querySelector(".inserted-quistions-wrapper"),
        questUpdateBtn: document.getElementById("question-update-btn"),
        questDeleteBtn: document.getElementById("question-delete-btn"),
        questcleareBtn: document.getElementById("question-clear-btn"),
        resultslistWrapper : document.querySelector(".results-list-wrapper"),
        clearResultsBtn: document.getElementById("results-clear-btn"),
        ///************* QUIZ SECTION Elements  ****************/
        quizSection: document.querySelector(".quiz-container"),
        askedQuestionText: document.getElementById("asked-question-text"),
        quizOptionsWrapper: document.querySelector(".quiz-options-wrapper"),
        progressBar: document.querySelector("progress"),
        progressPar: document.getElementById("progressp"),
        instAnsContainer: document.querySelector('.instant-answer-container'),
        instAnsText: document.getElementById("instant-answer-text"),
        instAnsDiv: document.getElementById("instant-answer-wrapper"),
        emotionIcon: document.getElementById("emotion"),
        nextQuestbtn: document.getElementById("next-question-btn"),
        //**************** landing page elements *************/
        landPageSection: document.querySelector(".landing-page-container"),
        startQuizBtn: document.getElementById("start-quiz-btn"),
        firstNameInput: document.getElementById("first-name"),
        lastNameInput: document.getElementById("last-name"),
        //**************** final resul element section **************/
        finalResultSection: document.querySelector(".final-result-container"),
        finalScoreText: document.getElementById("final-score-text")
        };

        return  {
                getDomItems: domItems,

                
                addInputsDynamically: function() {

                        var addInput = function() {
                                
                                var inputHTML, z;

                                z = document.querySelectorAll('.admin-option').length;

                                inputHTML = '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + z + '" name="answer" value="' + z + '"><input type="text" class="admin-option admin-option-' + z + '" value=""></div>';

                                domItems.adminOptionsContainer.insertAdjacentHTML('beforeend', inputHTML);

                                domItems.adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInput);
                        
                                domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);

                        }
                      
                        domItems.adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInput);
                },

              
                createQuestionList : function(getQuestions){

                        var questHTML, numberingArr; 

                        numberingArr = [];

                     domItems.insertedQuestsWrapper.innerHTML = "" ;
                     
                     for (var i = 0 ; i < getQuestions.getQuestionCollection().length; i++) {

                                numberingArr.push( i+1 );

                                questHTML = '<p><span>' + numberingArr[i] + '.'+ getQuestions.getQuestionCollection()[i].questionText 
                                +'</span><button id="question-'+ getQuestions.getQuestionCollection()[i].id +'">EDIT</button></p>'

                                domItems.insertedQuestsWrapper.insertAdjacentHTML('afterbegin', questHTML);
                     }

                },
                editQuestionList: function(event, storageQuestionList ,addInpsdynfn , uptadeQuestListFN) {
                        var getID , getStorageQuestList , foundItem , placeInArr , optionHTML;


                        if('question-'.indexOf(event.target.id)) {

                                getID = parseInt (event.target.id.split('-')[1]);

                                getStorageQuestList = storageQuestionList.getQuestionCollection();

                                for(var i = 0; i< getStorageQuestList.length; i++) {

                                        if(getStorageQuestList[i].id === getID ) {

                                                foundItem =  getStorageQuestList[i];

                                                placeInArr = i ;
                                        }
                                }
                        
                                domItems.newQuestionText.value = foundItem.questionText;

                                domItems.adminOptionsContainer.innerHTML = '';

                                optionHTML = '';

                                for(var x=0 ; x < foundItem.options.length ; x++) {

                                        optionHTML += '<div class="admin-option-wrapper"><input type="radio" class="admin-option-' + x + '" name="answer" value="' + x + '"><input type="text" class="admin-option admin-option-' + x + '" value="' + foundItem.options[x] +'"></div>';

                                }

                                domItems.adminOptionsContainer.innerHTML = optionHTML;

                                domItems.questUpdateBtn.style.visibility = 'visible';
                                domItems.questDeleteBtn.style.visibility = 'visible';
                                domItems.qustInsertBtn.style.visibility = 'hidden';
                                domItems.questcleareBtn.style.pointerEvents = 'none';
                                

                                addInpsdynfn();

                                var backDefaultView = function() {
                                        var updatedOptions;
                                        
                                domItems.newQuestionText.value = '';
                                updatedOptions = document.querySelectorAll(".admin-option");

                                for(var i= 0 ; i < updatedOptions.length ; i++) {
                                        updatedOptions[i].value = '';
                                        updatedOptions[i].previousElementSibling.checked = false ;
                                }
                                domItems.questUpdateBtn.style.visibility = 'hidden';
                                domItems.questDeleteBtn.style.visibility = 'hidden';
                                domItems.qustInsertBtn.style.visibility = 'visible';
                                domItems.questcleareBtn.style.pointerEvents = '';

                                uptadeQuestListFN(storageQuestionList)
                                        
                                }
                                

                                var updateQuestion = function() {

                                        var newOptions, optionEls;
                                        newOptions = [];

                                        optionEls = document.querySelectorAll(".admin-option");

                                        foundItem.questionText = domItems.newQuestionText.value;
                                        
                                        foundItem.correctAnswer = '' ;

                                        for(var i = 0 ; i < optionEls.length; i++) {
                                                if(optionEls[i].value !== '') {
                                                        newOptions.push(optionEls[i].value)
                                                        if(optionEls[i].previousElementSibling.checked) {
                                                                foundItem.correctAnswer = optionEls[i].value;
                                                        }
                                                }
                                        }
                                        foundItem.options = newOptions;

                                                if(foundItem.questionText !== "" ) {
                                                        if(foundItem.options.length > 1) {
                                                                if(foundItem.correctAnswer !== "") {

                                        getStorageQuestList.splice(placeInArr,1,foundItem);

                                        storageQuestionList.setquestionCollection(getStorageQuestList);

                                        backDefaultView();
                                                                
                                                                
                                                                } else{
                                                                        alert('you missed to check correct Answer , or you checked answer without value');    
                                                                }
                                                        } else {
                                                                alert('you must update at least two options');
                                                        }
                                                } else {
                                                        alert('please update question');
                                                }
                                }
                                domItems.questUpdateBtn.onclick = updateQuestion;

                                var deleteQuestion = function() {

                                        getStorageQuestList.splice(placeInArr,1);

                                        storageQuestionList.setquestionCollection(getStorageQuestList);
                                        
                                        backDefaultView();
                                }

                                domItems.questDeleteBtn.onclick = deleteQuestion;
                        }

                },
                clearQuestList: function(storageQuestList) {
                        if(storageQuestList.getQuestionCollection() !== null) {
                       
                                if(storageQuestList.getQuestionCollection().length > 0) {

                                 var conf = confirm('warning ! you will lose entire question list');
                        
                                if(conf) {
                                        storageQuestList.removequestionCollection();

                                        domItems.insertedQuestsWrapper.innerHTML = '';
                                        }
                                
                                }
                        }

                },

                displayQuestion: function(storageQuestList,progress) {
                        
                        var newOptionHTML,charectorArr;

                        charectorArr = ['A','B','C','D','E','F'];
                        
                        if(storageQuestList.getQuestionCollection().length  > 0) {

                                domItems.askedQuestionText.textContent = storageQuestList.getQuestionCollection()[progress.questionIndex].questionText;

                                domItems.quizOptionsWrapper.innerHTML = '' ;

                                for(var i = 0; i < storageQuestList.getQuestionCollection()[progress.questionIndex].options.length; i++) {

                                        newOptionHTML = '<div class="choice-' + i + '">' + charectorArr[i] + '</span><p class="choice-' + i + '"><span class="choice-' + i + '">' + storageQuestList.getQuestionCollection()[progress.questionIndex].options[i] + '</p></div>';

                                        domItems.quizOptionsWrapper.insertAdjacentHTML('beforeend', newOptionHTML);
                                }

                        }

                },

                displayProgress: function(storageQuestionList, progress) {

                                domItems.progressBar.max = storageQuestionList.getQuestionCollection().length;

                                domItems.progressBar.value = progress.questionIndex +1;

                                domItems.progressPar.textContent = (progress.questionIndex + 1) + '/' + storageQuestionList.getQuestionCollection().length 

                },

                newDesign : function(ansResult , selectedAnswer) {

                        var twoOptions, index;

                        index = 0;

                        if(ansResult) {
                                index = 1;
                        }

                        twoOptions = {
                                instAnswerText: ['this is a wrong answer', ' this is a correct answer'],
                                insAnswerClass: ['red','green'],
                                emotionType:['sad-5219057_1280.webp','b885cc6b419a7f770798f65fceb75eb7.jpg'],
                                optionsSpanBg: ['rgba(200,0,0, .7)','rgba(0,250,0,.2)']
                        };

                        domItems.quizOptionsWrapper.style.cssText = "opacity: 0.6; pointer-events: none;";

                        domItems.instAnsContainer.style.opacity = "1";

                        domItems.instAnsText.textContent = twoOptions.instAnswerText[index];

                        domItems.instAnsDiv.className = twoOptions.insAnswerClass[index];

                        domItems.emotionIcon.setAttribute('src',twoOptions.emotionType[index]);

                
                        // one line deleted own risk

                },

                resetDesign: function() {

                        domItems.quizOptionsWrapper.style.cssText = "";

                        domItems.instAnsContainer.style.opacity = "0";

                },

                getFullName: function(currPerson, storageQuestList, admin) {

                        if(domItems.firstNameInput.value !== "" && domItems.lastNameInput.value !== "") {

                                if(!(domItems.firstNameInput.value === admin[0] && domItems.lastNameInput.value === admin[1])) {

                                        
                                                currPerson.fullname.push(domItems.firstNameInput.value);

                                                currPerson.fullname.push(domItems.lastNameInput.value);

                                                domItems.landPageSection.style.display = 'none';

                                                domItems.quizSection.style.display = 'block';

                                                console.log(currPerson);
                                        
                                } else {

                                        domItems.landPageSection.style.display = 'none';

                                        domItems.adminPanelSection.style.display = 'block';


                                }
                        } else {

                                alert('please enter your full name');
                        }

                },
                
                finalResult: function(currPerson) {

                        console.log('work');

                        domItems.finalScoreText.textContent = currPerson.fullname[0] + '  ' + currPerson.fullname[1] + '   total score is --   ' + currPerson.score;

                        domItems.quizSection.style.display = 'none';

                        domItems.finalResultSection.style.display = 'block';

                },
                addResultOnPanel: function(userData) {

                        var resultHTML;

                        domItems.resultslistWrapper.innerHTML = '';

                        for(var i=0 ; i < userData.getPersonData().length; i++) {
                                resultHTML = '<p class="person person-'+i+'"><span class="person-'+i+'">'+userData.getPersonData()[i].firstname +'       '+userData.getPersonData()[i].lastname  +  '   -- '+userData.getPersonData()[i].score+' --   points</span><button id="delete-result-btn_' + userData.getPersonData()[i].id + '" class="delete-result-btn"> delete</button></p>';

                                domItems.resultslistWrapper.insertAdjacentHTML('afterbegin', resultHTML);
                        }


                },

                deleteResult: function(event, userData) {

                        var getId, personsArr;

                        personsArr = userData.getPersonData();
                        

                        if('delete-result-btn_'.indexOf(event.target.id)) {

                                getId = parseInt(event.target.id.split('_')[1]);

                                for (var i=0 ; i < personsArr.length; i++) {

                                        if(personsArr[i].id === getId) {

                                                personsArr.splice(i, 1);

                                                userData.setPersonData(personsArr);
                                        }
                                }

                        }

                },

                clearREsultList : function(userData) {

                        var conf;

                        if(userData.getPersonData() !== null) {

                                if(userData.getPersonData().length > 0) {

                                        conf = confirm('warning ! you will loose entire result list');

                                        if(conf) {
                                                userData.removePersonData();

                                                domItems.resultslistWrapper.innerHTML = '';

                                        }                
                                }
                        }
                }

               
        };
}());

/***********************************************
 *               controller
 * ********************************************/
var controller = (function(quizctrl,UIctrl)  {

        var  selectDomItems = UIctrl.getDomItems;

        UIctrl.addInputsDynamically();

        UIctrl.createQuestionList(quizctrl.getQuestionLocalStorage);

        selectDomItems.qustInsertBtn.addEventListener('click',function(){

                var adminOptions = document.querySelectorAll('.admin-option');

                var checkBoolean = quizctrl.addQuestionOnLocalStorage(selectDomItems.newQuestionText, adminOptions);
                
                if(checkBoolean) {
                        UIctrl.createQuestionList(quizctrl.getQuestionLocalStorage);  
                }
        });

        selectDomItems.insertedQuestsWrapper.addEventListener('click', function(e) {

                UIctrl.editQuestionList(e, quizctrl.getQuestionLocalStorage, UIctrl.addInputsDynamically , UIctrl.createQuestionList);

        });

        selectDomItems.questcleareBtn.addEventListener('click', function(){

                UIctrl.clearQuestList(quizctrl.getQuestionLocalStorage);

        });
        UIctrl.displayQuestion(quizctrl.getQuestionLocalStorage ,quizctrl.getQuizProgress);

        UIctrl.displayProgress(quizctrl.getQuestionLocalStorage ,quizctrl.getQuizProgress);

        selectDomItems.quizOptionsWrapper.addEventListener('click', function(e) {

                var updatedOptionsDiv = selectDomItems.quizOptionsWrapper.querySelectorAll('div');

                for (var i = 0; i < updatedOptionsDiv.length; i++) {

                     if(e.target.className === 'choice-' + i) {
                        
                        var answer = document.querySelector('.quiz-options-wrapper div p.' + e.target.className);

                        var answerResult = quizctrl.checkAnswer(answer);

                        UIctrl.newDesign(answerResult, e.target);

                        if(quizctrl.isFinished()) {

                                selectDomItems.nextQuestbtn.textContent = "finish";
                        }

                        var nextQuestion = function(questData, progress) {
                                console.log('1 ');

                                if(quizctrl.isFinished()) {

                                        //finished quiz
                                        
                                        console.log('2 ');

                                        quizctrl.addPerson();

                                        UIctrl.finalResult(quizctrl.getCurrPersonData);

                                        console.log(quizctrl.getCurrPersonData);
                                        } else {

                                                UIctrl.resetDesign();

                                                quizctrl.getQuizProgress.questionIndex++;

                                                UIctrl.displayQuestion(quizctrl.getQuestionLocalStorage ,quizctrl.getQuizProgress);

                                                UIctrl.displayProgress(quizctrl.getQuestionLocalStorage ,quizctrl.getQuizProgress);

                                        
                                        }

                        };

                        selectDomItems.nextQuestbtn.onclick = function() {
                                nextQuestion(quizctrl.getQuestionLocalStorage, quizctrl.getQuizProgress);

                        };

                     }

                }    
                

        });

        selectDomItems.startQuizBtn.addEventListener('click', function() {

                UIctrl.getFullName(quizctrl.getCurrPersonData, quizctrl.getQuestionLocalStorage, quizctrl.getAdminFullName);
        });

        selectDomItems.lastNameInput.addEventListener('focus', function() {

                selectDomItems.lastNameInput.addEventListener('keypress', function(e) {

                        if(e.keyCode === 13) {

                                UIctrl.getFullName(quizctrl.getCurrPersonData, quizctrl.getQuestionLocalStorage, quizctrl.getAdminFullName);

                        }

                });

        });

        UIctrl.addResultOnPanel(quizctrl.getpersonLocalStorage);

        selectDomItems.resultslistWrapper.addEventListener('click' , function(e) {

                UIctrl.deleteResult(e, quizctrl.getpersonLocalStorage);

                UIctrl.addResultOnPanel(quizctrl.getpersonLocalStorage);


                        

        });

        selectDomItems.clearResultsBtn.addEventListener('click' ,function() {

                UIctrl.clearREsultList(quizctrl.getpersonLocalStorage);

        })

})(quizControler,UIController);