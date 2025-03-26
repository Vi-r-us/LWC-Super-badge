/**
 * @description       : A wrapper class to represent a range with minimum and maximum values.
 *                      This class is used to pass range data between Apex and Lightning components.
 *                      It is annotated with @AuraEnabled to allow its properties to be accessed
 *                      in Lightning Web Components or Aura components.
 *                      
 *                      Example Usage:
 *                      - Used to define a range for sliders or filters in the UI.
 *                      - Can be serialized and passed as part of a response from an Apex controller.
 *                      
 *                      Example JSON Representation:
 *                      {
 *                          "min": 10,
 *                          "max": 100
 *                      }
 *                      
 *                      Author: ChangeMeIn@UserSettingsUnder.SFDoc
 *                      Last Modified: 03-26-2025
 */
public with sharing class RangeWrapper {
    /**
     * @description       : The maximum value of the range.
     *                      This property is accessible in Lightning components.
     */
    @AuraEnabled
    public Integer max { get; set; }

    /**
     * @description       : The minimum value of the range.
     *                      This property is accessible in Lightning components.
     */
    @AuraEnabled
    public Integer min { get; set; }
}