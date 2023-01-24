Qualtrics.SurveyEngine.addOnload(function () {

    /*Place your JavaScript here to run when the page loads*/

    /* Change 2: Hiding the Next button */
    // Retrieve Qualtrics object and save in qthis
    var qthis = this;

    // Hide buttons
    qthis.hideNextButton();

    /* Change 3: Defining and load required resources */
    var jslib_url = "https://unpkg.com/";

    // the below urls must be accessible with your browser
    // for example, https://kywch.github.io/jsPsych/jspsych.js
    var requiredResources = [
        jslib_url + "jspsych@7.3.1",
        jslib_url + "@jspsych/plugin-preload@1.1.2",
        jslib_url + "@jspsych/plugin-fullscreen@1.1.2",
        jslib_url + "@jspsych/plugin-image-keyboard-response@1.1.2",
        jslib_url + "@jspsych/plugin-html-keyboard-response@1.1.2"
    ];

    function loadScript(idx) {
        console.log("Loading ", requiredResources[idx]);
        jQuery.getScript(requiredResources[idx], function () {
            if ((idx + 1) < requiredResources.length) {
                loadScript(idx + 1);
            } else {
                initExp();
            }
        });
    }

    if (window.Qualtrics && (!window.frameElement || window.frameElement.id !== "mobile-preview-view")) {
        loadScript(0);
    }

    /* Change 4: Appending the display_stage Div using jQuery */
    // jQuery is loaded in Qualtrics by default
    jQuery("<div id = 'display_stage_background'></div>").appendTo('body');
    jQuery("<div id = 'display_stage'></div>").appendTo('body');

	/* Change 6: Defining necessary variables and functions for saving the results */
    // experimental session-defining variables
    var task_name = "hello_world3";
    var sbj_id = "${e://Field/workerId}";

    // you must put your save_data php url here.
    var save_url = "https://poachiest-certifica.000webhostapp.com/exp_data/save_data3.php";
    var data_dir = task_name;

    // my preference is to include the task and sbj_id in the file name
    var file_name = task_name + '_' + sbj_id;

    function save_data_json() {
        jQuery.ajax({
            type: 'post',
            cache: false,
            url: save_url,
            data: {
                data_dir: data_dir,
                file_name: file_name + '.json', // the file type should be added
                exp_data: jsPsych.data.get().json()
            }
        });
    }

    function save_data_csv() {
        jQuery.ajax({
            type: 'post',
            cache: false,
            url: save_url,
            data: {
                data_dir: data_dir,
                file_name: file_name + '.csv', // the file type should be added
                exp_data: jsPsych.data.get().csv()
            }
        });
    }

    /* Change 5: Wrapping jsPsych.init() in a function */
    function initExp() {

      const jsPsych = initJsPsych({
        display_element: 'display_stage',

        /* Change 6: Adding the clean up and continue functions.*/
        on_finish: function (data) {

            /* Change 7: Calling the save function -- CHOOSE ONE! */
            // include the participant ID in the data
            // this must be done before saving
            jsPsych.data.get().addToLast({participant: sbj_id});

            save_data_csv();

            // clear the stage
            jQuery('display_stage').remove();
            jQuery('display_stage_background').remove();

            // simulate click on Qualtrics "next" button, making use of the Qualtrics JS API
            qthis.clickNextButton();
        }
      });

      stimArray = [];
      primesArray = [];
      targetsArray = [];

      one_to_seventy_two = [];
      for (var i = 1; i < 73; i++) {
        one_to_seventy_two.push(i)
      }

      var target_nums = jsPsych.randomization.sampleWithoutReplacement(one_to_seventy_two, 72);

      for(let i = 1; i < 13; i++) {
        stimArray.push({prime: "img/het"+i+".jpg", target: "img/pic"+target_nums[i-1]+".jpg"})
        primesArray.push("img/het"+i+".jpg")
        targetsArray.push("img/pic"+target_nums[i-1]+".jpg")
      }

      for(let i = 1; i < 13; i++) {
        stimArray.push({prime: "img/hom"+i+".jpg", target: "img/pic"+target_nums[11+i]+".jpg"})
        primesArray.push("img/het"+i+".jpg")
        targetsArray.push("img/pic"+target_nums[i-1]+".jpg")
      }

      for(let i = 1; i < 13; i++) {
        stimArray.push({prime: "img/gray_screen.png", target: "img/pic"+target_nums[23+i]+".jpg"})
        targetsArray.push("img/pic"+target_nums[i-1]+".jpg")
      }

      for(let i = 1; i < 13; i++) {
        stimArray.push({prime: "img/het"+i+".jpg", target: "img/pic"+target_nums[35+i]+".jpg"})
        targetsArray.push("img/pic"+target_nums[i-1]+".jpg")
      }

      for(let i = 1; i < 13; i++) {
        stimArray.push({prime: "img/hom"+i+".jpg", target: "img/pic"+target_nums[47+i]+".jpg"})
        targetsArray.push("img/pic"+target_nums[i-1]+".jpg")
      }

      for(let i = 1; i < 13; i++) {
        stimArray.push({prime: "img/gray_screen.png", target: "img/pic"+target_nums[59+i]+".jpg"})
        targetsArray.push("img/pic"+target_nums[i-1]+".jpg")
      }

      const preload = {
        type: jsPsychPreload,
        auto_preload: true,
        images: [primesArray, targetsArray, "img/blank_screen.png","img/gray_screen.png" ]
      }

      const enter_fullscreen = {
        type: jsPsychFullscreen,
        fullscreen_mode: true
      }

      const instructions1 = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
        <p>W tym zadaniu sprawdzamy w jaki sposób ludzie dokonują prostych sądów.</p>
        <p>W każdej próbie zobaczysz parę obrazków jeden po drugim. Pierwszy przedstawiał będzie zdjęcie.
        Drugi przedstawiał będzie chiński symbol. Pierwszy obrazek będzie jedynie ostrzegał, że za chwilę pojawi się chiński symbol i należy ten pierwszy obrazek zignorować</p><br />
        <p>Twoim zadaniem będzie ocena w jakim stopniu chiński symbol wydaje Ci się wizualnie przyjemny (w porównaniu do pozostałych).</p>
        <p>Nie ma tutaj dobry lub złych odpowiedzi. Odpowiedz zgodnie z tym co Ci podpowiada intuicja.</p>
        <p>Wciśnij spację, aby przejść dalej!</p>
        `,
        post_trial_gap: 500,
        choices: " "
      };

      const instructions2 = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
        <p>Połóż po 2 palce obu rąk na klawiszach Q, E, I, P. Oceń na ile chiński symbol wydaje Ci się przyjemny na skali od -2, -1, +1, +2, gdzie -2 oznacza zdecydowanie mniej przyjemny niż inne symbole, a +2 zdecydowanie bardziej przyjemny niż inne symbole.</p>
        <p>Jeżeli chcesz udzielić odpowiedzi -2 wciśnij Q, jeżeli chcesz udzielić odpowiedzi -1 wciśnij E, jeżeli chcesz udzielić odpowiedzi +1 wciśnij I, a jeżeli chcesz udzielić odpowiedzi +2 wciśnij P.
        <p>Wciśnij spację, aby przejść dalej!</p>
        `,
        post_trial_gap: 500,
        choices: " "
      };

      const instructions3 = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
        <p>Damy Ci teraz możliwość przećwiczyć to zadanie.</p>
        <p><b>Pamiętaj:</b> Twoim zdaniem jest ocena na ile chiński symbol jest wizualnie przyjemny przy pomocy skali od -2 do +2.</p>
        <p>Wciśnij spację, aby przejść dalej!</p>
        `,
        post_trial_gap: 500,
        choices: " "
      };

      const instructions4 = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
        <p><b>Dobrze!</b> Teraz rozpocznie się faza testowa. Postępuj tak jak poprzednio.</p>
        <p><b>Dla przypomnienia:</b> Jeżeli chiński symbol wydaje Ci się mniej wizualnie przyjemny niż inne, wciśnij odpowiedź -2 lub -1 (tj. klawisz Q lub E).</p>
        <p>Jeżeli chiński symbol wydaje Ci się bardziej wizualnie przyjemny niż inne, wciśnij odpowiedź +1 lub +2 (tj. klawisz I lub P).</p>
        <p>Wciśnij spację, aby przejść dalej!</p>
        `,
        post_trial_gap: 500,
        choices: " "
      };

      const instructions5 = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
        <p>Dobrze! W tej części, Twoim zadaniem będzie ocena w jakim stopniu zdjęcie wyświetlane przed chińskim symbolem wydaje Ci się wizualnie przyjemne (w porównaniu do pozostałych).</p>
        <p>Nie ma tutaj dobry lub złych odpowiedzi. Odpowiedz zgodnie z tym co Ci podpowiada intuicja.</p>
        <p>Wciśnij spację, aby przejść dalej!</p>
        `,
        post_trial_gap: 500,
        choices: " "
      };

      const instructions6 = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: `
        <p><b>Pamiętaj:</b> Jeżeli zdjęcie (<i>nie chiński symbol</i>)wydaje Ci się mniej wizualnie przyjemne niż inne, wciśnij odpowiedź -2 lub -1 (tj. klawisz Q lub E).</p>
        <p>Jeżeli zdjęcie wydaje Ci się bardziej wizualnie przyjemne niż inne, wciśnij odpowiedź +1 lub +2 (tj. klawisz I lub P).</p>
        <p>Wciśnij spację, aby przejść dalej!</p>
        `,
        post_trial_gap: 500,
        choices: " "
      };


      const start = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: "Wciśnij spację, aby rozpocząć!",
        post_trial_gap: 1000,
        choices: " "
      }

      const prompt_chinese = `<div style='position: absolute; left: 43%; bottom: 15%''><b>Jak oceniasz chiński symbol?</b></div>
               <div style='position: absolute; left: 20%; bottom: 10%'><b>-2</b></div>
               <div style='position: absolute; left: 40%; bottom: 10%'><b>-1</b></div>
               <div style='position: absolute; right: 40%; bottom: 10%'><b>+1</b></div>
               <div style='position: absolute; right: 20%; bottom: 10%'><b>+2</b></div>
               <div style='position: absolute; left: 20%; bottom: 5%'><b>(Q)</b></div>
               <div style='position: absolute; left: 40%; bottom: 5%'><b>(E)</b></div>
               <div style='position: absolute; right: 40%; bottom: 5%'><b>(I)</b></div>
               <div style='position: absolute; right: 20%; bottom: 5%'><b>(P)</b></div>
              `

      const amp_prime = {
        type: jsPsychImageKeyboardResponse,
        stimulus: jsPsych.timelineVariable('prime'),
        stimulus_height: 300,
        stimulus_width: 400,
        choices: "NO_KEYS",
        trial_duration: 100,
        response_ends_trial: false,
        prompt: prompt_chinese
      }

      const amp_blank = {
        type: jsPsychImageKeyboardResponse,
        stimulus: "img/blank_screen.png",
        stimulus_height: 300,
        stimulus_width: 400,
        choices: "NO_KEYS",
        trial_duration: 125,
        response_ends_trial: false,
        prompt: prompt_chinese
      }

      const amp_target = {
        type: jsPsychImageKeyboardResponse,
        stimulus: jsPsych.timelineVariable('target'),
        choices: "NO_KEYS",
        trial_duration: 100,
        response_ends_trial: false,
        prompt: prompt_chinese
      }

      const amp_mask = {
        type: jsPsychImageKeyboardResponse,
        stimulus: "img/mask.jpg",
        choices: ['q','e','i','p'],
        prompt: prompt_chinese
      }


      const amp_procedure_practice = {
        timeline: [amp_prime, amp_blank, amp_target, amp_mask],
        timeline_variables: stimArray,
        randomize_order: true,
        sample: {
          type: 'without-replacement',
          size: 12
        }
      }

      const amp_procedure = {
        timeline: [amp_prime, amp_blank, amp_target, amp_mask],
        timeline_variables: stimArray,
        randomize_order: true
      }


      const prompt_image = `<div style='position: absolute; left: 43%; bottom: 15%''><b>Jak oceniasz pierwsze zdjęcie?</b></div>
               <div style='position: absolute; left: 20%; bottom: 10%'><b>-2</b></div>
               <div style='position: absolute; left: 40%; bottom: 10%'><b>-1</b></div>
               <div style='position: absolute; right: 40%; bottom: 10%'><b>+1</b></div>
               <div style='position: absolute; right: 20%; bottom: 10%'><b>+2</b></div>
               <div style='position: absolute; left: 20%; bottom: 5%'><b>(Q)</b></div>
               <div style='position: absolute; left: 40%; bottom: 5%'><b>(E)</b></div>
               <div style='position: absolute; right: 40%; bottom: 5%'><b>(I)</b></div>
               <div style='position: absolute; right: 20%; bottom: 5%'><b>(P)</b></div>
              `

      const amp_prime_exp = {
        type: jsPsychImageKeyboardResponse,
        stimulus: jsPsych.timelineVariable('prime'),
        stimulus_height: 300,
        stimulus_width: 400,
        choices: "NO_KEYS",
        trial_duration: 100,
        response_ends_trial: false,
        prompt: prompt_image
      }

      const amp_blank_exp = {
        type: jsPsychImageKeyboardResponse,
        stimulus: "img/blank_screen.png",
        stimulus_height: 300,
        stimulus_width: 400,
        choices: "NO_KEYS",
        trial_duration: 125,
        response_ends_trial: false,
        prompt: prompt_image
      }

      const amp_target_exp = {
        type: jsPsychImageKeyboardResponse,
        stimulus: jsPsych.timelineVariable('target'),
        choices: "NO_KEYS",
        trial_duration: 100,
        response_ends_trial: false,
        prompt: prompt_image
      }

      const amp_mask_exp = {
        type: jsPsychImageKeyboardResponse,
        stimulus: "img/mask.jpg",
        choices: ['q','e','i','p'],
        prompt: prompt_image
      }

      const amp_procedure_exp = {
        timeline: [amp_prime_exp, amp_blank_exp, amp_target_exp, amp_mask_exp],
        timeline_variables: stimArray.slice(0, 24),
        randomize_order: true
      }


      const exit_fullscreen = {
        type: jsPsychFullscreen,
        fullscreen_mode: false
      }

      jsPsych.run([preload, enter_fullscreen, instructions1, instructions2, instructions3,
        start, amp_procedure_practice, instructions4,
        start,  amp_procedure, instructions5, instructions6,
        start, amp_procedure_exp, exit_fullscreen]);

    }
});

Qualtrics.SurveyEngine.addOnReady(function () {
    /*Place your JavaScript here to run when the page is fully displayed*/

});

Qualtrics.SurveyEngine.addOnUnload(function () {
    /*Place your JavaScript here to run when the page is unloaded*/

});
