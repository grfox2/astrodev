/* *
 * File: telescopeCalcInterface.js
 *
 * Summary: Controls the user interface of the calculator. 
 *
 * Description: This module handles the interaction between the user interface
 * and the processing module telescopeCalculator.
 *
 * It specifies the handling functions that take care of the user input,
 * pass it to the processing module, and display the results or possible error messages
 * on the webpage. The core function for this process is calcTelescopeCharacteristics.
 *
 * There are additional functions that take care of interactive features of the page
 * such as showing/hiding optional input values (Barlow and Focal Reducer fields).
 *
 * Usage: Included at the bottom of the HTML body section and after telescopeCalculator.js
 * has been included.
 *
 * Author: Gerardo Ramon Fox
 * Last Revision: 31 Jan 2021
 *
 * Copyright (C) 2021 Felipe Gerardo Ramon Fox
 * See LICENSE or LICENSE.txt for license information.
 */

'use strict';

// Assigning event listeners
let incBarlowCheck = document.getElementById('includeBarlow');
incBarlowCheck.addEventListener('change', showBarlowBox);

let incFocalRedCheck = document.getElementById('includeFocalReducer');
incFocalRedCheck.addEventListener('change', showFocalReducerBox);

let calcMagBtn = document.getElementById('calcMag');
calcMagBtn.addEventListener('click', calcTelescopeCharacteristics);

let resetBtn = document.getElementById('resetBtn');
resetBtn.addEventListener('click', resetForm);

/**
 * Summary: Hides/Shows Barlow input field if the user activates the check box.
 */
function showBarlowBox(event) {
    if (event.target.checked) {
        document.getElementById('barlowLabel').hidden = false;
        document.getElementById('barlowPower').hidden = false;
    } else {
        document.getElementById('barlowLabel').hidden = true;
        document.getElementById('barlowPower').hidden = true;
    }
}

/**
 * Summary: Hides/Shows the Focal Reducer input field if the user activates the check box.
 */
function showFocalReducerBox(event) {
    if (event.target.checked) {
        document.getElementById('fReducerLabel').hidden = false;
        document.getElementById('fReducerFactor').hidden = false;
    } else {
        document.getElementById('fReducerLabel').hidden = true;
        document.getElementById('fReducerFactor').hidden = true;
    }
}

/**
 * Summary: Resets the form to its initial state.
 *
 * Description: Resets the form to its initial state, which means that the input fields
 * are set to zero and the Barlow and Focal Reducer check boxes are unchecked.
 */
function resetForm() {
    
    document.getElementById('magCalc').reset();
    for (let disp of document.querySelectorAll('.resultDisplay')) {
        disp.textContent = "";
        disp.style.fontStyle = "";
    }
    
    document.getElementById('barlowLabel').hidden = true;
    document.getElementById('barlowPower').hidden = true;
    
    document.getElementById('fReducerLabel').hidden = true;
    document.getElementById('fReducerFactor').hidden = true;
}

/**
 * Summary: Calculates the telescope's characteristic from the properties entered in the form.
 *
 * Description: Handles the calculation of several telescope characteristics such as:
 * the magnification, magnification limits, f/ number, and resolving power as 
 * a function of the telescope's parameters;
 * there are three required parameters: 
 * the objective diameter, the telescope's focal length, the eypiece's focal length
 * there are two optional parameters: the Barlow lens power and the focal reducer factor;
 * if the input retrieved from the form is not valid, it returns appropriate error messages.
 */
function calcTelescopeCharacteristics() {
    
    // Store the webpage elements that handle the display of the calculation results.
    let resultContainers = {};
    resultContainers["magResult"] = document.getElementById('magResult');
    resultContainers["lowerMagLimResult"] = document.getElementById('lowerMagLimit');
    resultContainers["upperMagLimResult"] = document.getElementById('upperMagLimit');
    resultContainers["fRatioResult"] = document.getElementById('fRatioResult');
    resultContainers["dawesLimitResult"] = document.getElementById('dawesLimitRes');
    
    // Retrieve the browser languge tag (assumes English by default).
    // Error messages can be defined here to match the language of the UI webpage.
    let langTag = document.getElementsByTagName('html')[0].getAttribute('lang');
    let incorrectTypeErrorMessage = "Error: Incorrect input type, please check that your inputs are numbers.";
    let rangeErrorMessage = "Error: Please check that the telescope and eyepiece focal lengths, Barlow lens power and/or Focal reducer factor are positive.";
    if (langTag == "es") {
        incorrectTypeErrorMessage = "Error: dato de entrada incorrecto, por favor revise que las entradas sean numeros.";
        rangeErrorMessage = "Error: Por favor revise que las longitudes focales de telescopio, ocular, el aumento de la lente de Barlow y/o el factor de reduccion focal sean positivos.";
    }
    
    // Resets the font-style property of the display elements (error messages use italic).
    for (let disp of document.querySelectorAll('.resultDisplay')) {
        disp.style.fontStyle = "";
    }
    
    try {
        // Retrieve the data from the form.
        let inputData = {};
        inputData["telDiameter"] = Number(document.getElementById('telDiameter').value);
        inputData["telFocalLength"] = Number(document.getElementById('telFocalLength').value);
        inputData["epFocalLength"] = Number(document.getElementById('epFocalLength').value);
        inputData["barlowFactor"] = 1.0;
        inputData["focalReducerFactor"] = 1.0;
        
        if (! document.getElementById('barlowPower').hidden) {
            inputData["barlowFactor"] = Number(document.getElementById('barlowPower').value);
        }
        if (! document.getElementById('fReducerFactor').hidden) {
            inputData["focalReducerFactor"] = Number(document.getElementById('fReducerFactor').value);
        }
        
        // Check that all the inputs are numeric.
        for (let key in inputData) {
            if (isNaN(inputData[key])) {
                throw new SyntaxError("Textbox input for " + key + " is not a number.");
            }
        }

        // Start the telescope calculator.
        let telescope = new TelescopeCalc(inputData["telDiameter"], 
                                          inputData["telFocalLength"], 
                                          inputData["epFocalLength"], 
                                          inputData["barlowFactor"], 
                                          inputData["focalReducerFactor"]);
        
        // Calculate the results.
        let magnification = telescope.calcMagnification();
        let lowerLimMag = telescope.calcLowerMagnificationLimit();
        let upperLimMag = telescope.calcUpperMagnificationLimit();
        let fNumber = telescope.calcFocalRatio();
        let dawesLimit = telescope.calcDawesLimit();
        
        // Display the results on the webpage.
        resultContainers["magResult"].textContent = String(magnification.toFixed(2)) + " x";
        resultContainers["lowerMagLimResult"].textContent = String(lowerLimMag.toFixed(2)) + " x";
        resultContainers["upperMagLimResult"].textContent = String(upperLimMag.toFixed(2)) + " x";
        resultContainers["fRatioResult"].textContent = String(fNumber.toFixed(2));
        resultContainers["dawesLimitResult"].textContent = String(dawesLimit.toFixed(2)) + " arcsec";
        
    } catch(e) {
        if (e instanceof RangeError) {
            for (let key in resultContainers) {
                resultContainers[key].textContent = rangeErrorMessage;
                resultContainers[key].style.fontStyle = "italic";
            }   
            console.log(e);
        }
        if (e instanceof SyntaxError) {
            for (let key in resultContainers) {
                resultContainers[key].textContent = incorrectTypeErrorMessage;
                resultContainers[key].style.fontStyle = "italic";
            }
            console.log(e);
        }
    }
}
