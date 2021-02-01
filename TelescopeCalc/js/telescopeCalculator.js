/* *
 * File: telescopeCalculator.js
 *
 * Summary: Defines the class TelescopeCalc, which provides several functions to calculate 
 * telescope power parameters as a function of three required parameters: diameter, focal length, 
 * and eyepeice focal length, and optionally Barlow and Focal Reducer factors.
 *
 * Description: Thie class TelescopeCalc provides functions to calculate several telescope power 
 * parameters such as the magnification, the focal ratio, and the resolving power as a function of 
 * three required parameters: 
 *      diameter, focal length, and eyepiece focal length;
 * and optionally:
 *      Barlow Lens and Focal Reducer power factors
 *
 * The diameter, focal length, and eyepiece focal length are required to be expresssed in millimeters.
 *
 * The Barlow and Focal Reducer factors are dimensionless.
 *
 * The class provides functions to calculate the following quantities:
 *      -Magnification
 *      -Upper Magnification Limit
 *      -Lower Magnification Limit
 *      -Focal Ratio
 *      -Exit Pupil
 *      -Dawes Limit (or Resolving Power)
 *
 *
 * Usage: A telescopeCalculator object can be initialized as in general with:
 *      let myTelescope = new TelescopeCalc(diameter, focalLength, eyepieceFocalLength,
 *                                          barlowFactor=myBarlowFactor,
 *                                          focalReducerFactor=myFocalReducerFactor);
 *      Or:
 *      let myTelescope = new TelescopeCalc(diameter, focalLength, eyepieceFocalLength);
 *      This sets barlowFactor and focalReducerFactor to 1 by default.
 *
 *      All of the values must be positive. A RangeError is raised if a negative value is passed.
 *
 *      Then call a function to get a result (e.g magnification):
 *      let magnification = myTelescope.getMagnification();
 *
 * Exceptions: A RangeError is raised if a negative value is passed when attempting to initialize a
 * TelescopeCalc object.
 *      
 * Author: Gerardo Ramon Fox
 * Last Revision: 31 Jan 2021
 *
 * Copyright (C) 2021 Felipe Gerardo Ramon Fox
 * See LICENSE or LICENSE.txt for license information.
 */

/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

'use strict';

 class TelescopeCalc {

    /**
    * Summary: Initializes a TelescopeCalc object.
    *
    * Description: Initializes a TelescopeCalc object.
    *
    * Parameters:
    * (Number) telDiameter          telescope aperture diameter in millimeters (positive).
    * (Number) telFocalLength       telescope focal length in millimeters (positive).
    * (Number) epFocalLength        eyepiece focal length in millimeters (positive).
    * (Number) barlowFactor         Barlow Lens Power Factor (positive).
    * (Number) focalReducerFactor   Focal Reducer Power Factor (positive).
    *
    * Exceptions:
    * A TypeError exception is raised if a required parameter is missing.
    * A RangeError exception is raised if a parameter is out of range.
    */
    constructor(telDiameter, telFocalLength, epFocalLength, barlowFactor=1, focalReducerFactor=1) {
        if ((telDiameter === undefined) || (telFocalLength === undefined) || (epFocalLength === undefined)) {
            throw new TypeError("arguments telDiameter, telFocalLength, epFocalLength are required.");
        }

        if (telDiameter <= 0) {
            throw new RangeError("argument telDiameter has to be greater than 0.");
        }
        if (telFocalLength <= 0) {
            throw new RangeError("argument telFocalLength has to be greater than 0.");
        }
        if (epFocalLength <= 0) {
            throw new RangeError("argument epFocalLength has to be greater than 0.");
        }
        if (barlowFactor <= 0) {
            throw new RangeError("argument barlowFactor has to be greater than 0.");
        }
        if (focalReducerFactor <= 0) {
            throw new RangeError("argument focalReducerFactor has to be greater than 0.");
        }
        
        this._telDiameter = telDiameter;
        this._telFocalLength = telFocalLength;
        this._epFocalLength = epFocalLength;
        this._barlowFactor = barlowFactor;
        this._focalReducerFactor = focalReducerFactor;
    }
    
    get telDiameter() {
        return this._telDiameter;
    }

    get telFocalLength() {
        return this._telFocalLength;
    }

    get epFocalLength() {
        return this._epFocalLength;
    }

    get barlowFactor() {
        return this._barlowFactor;
    }

    get focalReducerFactor() {
        return this._focalReducerFactor;
    }

    set telDiameter(newTelDiameter) {
        if (newTelDiameter <= 0) {
            throw new RangeError("telDiameter has to be greater than 0.");
        }
        this._telDiameter = newTelDiameter;
    }

    set telFocalLength(newFocalLength) {
        if (newFocalLength <= 0) {
            throw new RangeError("focalLength has to be greater than 0.");
        }
        this._telFocalLength = newFocalLength;
    }

    set epFocalLength(newEpFocalLength) {
        if (newEpFocalLength <= 0) {
            throw new RangeError("epFocalLength has to be greater than 0.");
        }
        this._epFocalLength = newEpFocalLength;
    }

    set barlowFactor(newBarlowFactor) {
        if (newBarlowFactor <= 0) {
            throw new RangeError("barlowFactor has to be greater than 0.");
        }
        this._barlowFactor = newBarlowFactor;
    }

    set focalReducerFactor(newFRedFactor) {
        if (newFRedFactor <= 0) {
            throw new RangeError("focalReducerFactor has to be greater than 0.");
        }
        this._focalReducerFactor = newFRedFactor;
    }

    /**
     * Summary: Returns the magnification of the telescope.
     */
    calcMagnification() {

        return (this._barlowFactor * this._telFocalLength * this._focalReducerFactor / this._epFocalLength);
    }
    
    /**
     * Summary: Returns the Lower Magnification Limit assuming a 6.0 mm exit pupil.
     */
    calcLowerMagnificationLimit() {
        
        return (this._telDiameter / 6.0);
    }
    
    /**
     * Summary: Returns the Upper Magnification Limit.
     */
    calcUpperMagnificationLimit() {
        
        return (2.0 * this._telDiameter);
    }
    
    /**
     * Summary: Returns the Focal Ratio.
     */
    calcFocalRatio() {
        
        return ((this._barlowFactor * this._telFocalLength / this._telDiameter) * this._focalReducerFactor);
    }
    
    /**
     * Summary: Returns the exit pupil in mm.
     */
    calcExitPupil() {
        
        return (this._telDiameter / this.calcMagnification());
    }
    
    /**
     * Summary: Returns the Dawes Limit (resolving power) in arc seconds.
     */
    calcDawesLimit() {
        return (116. / this._telDiameter);
    } 
}
