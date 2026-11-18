/**
 * Sample JSON bundles for InoJson Script Compare & Diff
 * Featuring realistic enterprise low-code form configurations with escaped clientscripts
 */

export const SAMPLE_BASE_JSON = {
  "bundleId": "bundle_appeal_intake_v1",
  "bundleName": "Appeal Intake & Investigation Form",
  "version": "1.4.2",
  "environment": "production",
  "formSettings": {
    "title": "Provider Dispute & Appeal Workflow",
    "theme": "indigo",
    "stepper": true,
    "sections": [
      { "key": "case_intake_summary", "title": "Intake Summary" },
      { "key": "case_good_cause", "title": "Good Cause Review" },
      { "key": "case_wol", "title": "WOL Verification" },
      { "key": "case_validation", "title": "Case Validation & Classification" },
      { "key": "case_investigation", "title": "Investigation" },
      { "key": "case_closing", "title": "Closing" },
      { "key": "reopen", "title": "Reopen Case" }
    ]
  },
  "clientscripts": {
    "prescript": "debugger;\r\nconsole.info(\"model====>\", model);\r\nconsole.info(\"editor====>\", editor);\r\nconst currentStep = editor.appService.stepperViewRef?.currentSectionKey;\r\nconst submitFlag = editor.isSaveAndSubmit;\r\nconst appealConfig = editor.getBPCRecordValue(model);\r\n\r\n// =============== Utility =============== //\r\n\r\nfunction confirmInvestigationCompletion() {\r\n    const effectuationFields = [\r\n        \"date_of_effectuation\",\r\n        \"effectuation_proof\",\r\n        \"new_claim_number\",\r\n        \"check_number\",\r\n        \"effectuated_paid_date\",\r\n        \"check_mailed_date\"\r\n    ];\r\n    const rationaleFields = [\r\n        \"decision\",\r\n        \"review_decision_rationale\",\r\n        \"final_rationale_decision\"\r\n    ];\r\n\r\n    try {\r\n        const twoStepClinicalTaskRequired = appealConfig?.two_step_clinical_review_decision_required === \"Yes\" || false;\r\n        function checkDecision(decision, taskName) {\r\n            switch (decision) {\r\n                case \"Approve\":\r\n                    editor.showAlert('Warning', 'Please complete Effectuation Task to complete Investigation!', 'warning');\r\n                    return false;\r\n                case \"Deny\":\r\n                    editor.showAlert('Warning', 'Please complete Rationale Review Task to complete Investigation!', 'warning');\r\n                    return false;\r\n                default:\r\n                    editor.showAlert('Warning', `Please complete ${taskName} first!`, 'warning');\r\n                    return false;\r\n            }\r\n        }\r\n        return true;\r\n    } catch (error) {\r\n        console.error(\"Error in confirmInvestigationCompletion():\", error);\r\n        return false;\r\n    }\r\n}\r\n\r\nif (model.case_intake_summary_step_status === \"Open\") {\r\n    model.case_intake_summary_step_status = \"Inprogress\";\r\n    model.caseStatus = \"Ready For Case Intake Summary\";\r\n}\r\n",
    "postscript": "debugger;\r\nconsole.info(\"model====>\", model);\r\nconsole.info(\"editor====>\", editor);\r\nconst loggedin_user_id = editor?.appService?.appPermissions?.userProfileInfo?.idStr || \"\";\r\nconst assigned_user_id = model?.pzeon_assignee_to?.[0] || \"\";\r\n\r\nif (model?.case_closing_step_status === \"Completed\" && (model?.is_reopen_confirmed ?? \"No\") !== \"Yes\") {\r\n    editor.hideSaveBtn();\r\n    editor.hideSubmitBtn();\r\n} else {\r\n    editor.showSaveBtn();\r\n    editor.showSubmitBtn();\r\n}\r\n\r\nfunction setHidden(fields, value) {\r\n    fields.forEach(field => {\r\n        if (fieldList[field]) fieldList[field][\"hidden\"] = value;\r\n    });\r\n}\r\n\r\nconsole.log(\"FieldList - End of Postscript\", fieldList);\r\n",
    "onSaveScript": "console.info(\"this is an post save/update script ====>\");\r\nconsole.info(\"model====>\", model);\r\n",
    "preScriptEnabled": true,
    "postScriptEnabled": true,
    "isPreScriptSync": false,
    "onSaveScriptEnabled": true
  },
  "validationRules": [
    { "field": "case_id", "rule": "required" },
    { "field": "received_date", "rule": "valid_date" }
  ]
};

export const SAMPLE_TARGET_JSON = {
  "bundleId": "bundle_appeal_intake_v2",
  "bundleName": "Appeal Intake & Investigation Form",
  "version": "1.5.0-RC1",
  "environment": "staging",
  "formSettings": {
    "title": "Provider Dispute & Appeal Workflow",
    "theme": "indigo",
    "stepper": true,
    "sections": [
      { "key": "case_intake_summary", "title": "Intake Summary" },
      { "key": "case_good_cause", "title": "Good Cause Review" },
      { "key": "case_wol", "title": "WOL Verification" },
      { "key": "case_validation", "title": "Case Validation & Classification" },
      { "key": "case_investigation", "title": "Investigation" },
      { "key": "case_closing", "title": "Closing" },
      { "key": "reopen", "title": "Reopen Case" }
    ]
  },
  "clientscripts": {
    "prescript": "debugger;\r\nconsole.info(\"model====>\", model);\r\nconsole.info(\"editor====>\", editor);\r\nconst currentStep = editor.appService.stepperViewRef?.currentSectionKey;\r\nconst submitFlag = editor.isSaveAndSubmit;\r\nconst appealConfig = editor.getBPCRecordValue(model);\r\n\r\n// =============== Utility =============== //\r\n\r\nfunction confirmInvestigationCompletion() {\r\n    const effectuationFields = [\r\n        \"date_of_effectuation\",\r\n        \"effectuation_proof\",\r\n        \"new_claim_number\",\r\n        \"check_number\",\r\n        \"effectuated_paid_date\",\r\n        \"check_mailed_date\"\r\n    ];\r\n    const rationaleFields = [\r\n        \"decision\",\r\n        \"review_decision_rationale\",\r\n        \"final_rationale_decision\"\r\n    ];\r\n\r\n    try {\r\n        const twoStepClinicalTaskRequired = appealConfig?.two_step_clinical_review_decision_required === \"Yes\" || false;\r\n        function checkDecision(decision, taskName) {\r\n            const rationaleTaskCompleted = model?.final_rationale_decision && model.final_rationale_decision.trim() !== \"\";\r\n            const effectuationTaskCompleted = model?.date_of_effectuation && model.date_of_effectuation !== \"\";\r\n\r\n            switch (decision) {\r\n                case \"Approve\":\r\n                    if (effectuationFields.some(field => !model?.[field]) && !effectuationTaskCompleted) {\r\n                        editor.askToConfirm(true, 'Please complete Effectuation Task to complete Investigation!', 'info', false, '', '', true, 'Ok', '#dc3545');\r\n                        return false;\r\n                    } else return true;\r\n                    break;\r\n                case \"Deny\":\r\n                    if (rationaleFields.some(field => !model?.[field]) && !rationaleTaskCompleted) {\r\n                        editor.askToConfirm(true, 'Please complete Rationale Review Task to complete Investigation!', 'info', false, '', '', true, 'Ok', '#dc3545');\r\n                        return false;\r\n                    } else return true;\r\n                    break;\r\n                case \"Partially Deny\":\r\n                    if (rationaleFields.some(field => !model?.[field]) && effectuationFields.some(field => !model?.[field]) && !rationaleTaskCompleted && !effectuationTaskCompleted) {\r\n                        editor.askToConfirm(true, 'Please complete Rationale Review and Effectuation Task to complete Investigation!', 'info', false, '', '', true, 'Ok', '#dc3545');\r\n                        return false;\r\n                    } else return true;\r\n                    break;\r\n                default:\r\n                    editor.askToConfirm(true, `Please complete ${taskName} first!`, 'info', false, '', '', true, 'Ok', '#dc3545');\r\n                    return false;\r\n            }\r\n        }\r\n\r\n        if (model.whoMadeTheRequest === \"NCP\") {\r\n            fieldList.valid_wol_received.disabled = true;\r\n        }\r\n\r\n        if (model?.review_type === \"Clinical\") {\r\n            return checkDecision(twoStepClinicalTaskRequired ? model?.clinicalDecision : model?.mdDecision, \"Clinical Task\");\r\n        }\r\n        return true;\r\n    } catch (error) {\r\n        console.error(\"Error in confirmInvestigationCompletion():\", error);\r\n        return false;\r\n    }\r\n}\r\n\r\nif (model.case_intake_summary_step_status === \"Open\") {\r\n    model.case_intake_summary_step_status = \"Inprogress\";\r\n    model.caseStatus = \"Ready For Case Intake Summary\";\r\n}\r\n",
    "postscript": "debugger;\r\nconsole.info(\"model====>\", model);\r\nconsole.info(\"editor====>\", editor);\r\nconst loggedin_user_id = editor?.appService?.appPermissions?.userProfileInfo?.idStr || \"\";\r\nconst assigned_user_id = model?.pzeon_assignee_to?.[0] || \"\";\r\n\r\n// Enhanced quality review status gate\r\nif (model?.case_closing_step_status === \"Completed\" && (model?.is_reopen_confirmed ?? \"No\") !== \"Yes\") {\r\n    editor.hideSaveBtn();\r\n    editor.hideSubmitBtn();\r\n} else if (model.caseStatus === \"Ready For Quality Review\") {\r\n    if (loggedin_user_id === assigned_user_id) {\r\n        editor.showSaveBtn();\r\n        editor.hideSubmitBtn();\r\n    } else {\r\n        editor.hideSaveBtn();\r\n        editor.hideSubmitBtn();\r\n    }\r\n} else {\r\n    editor.showSaveBtn();\r\n    editor.showSubmitBtn();\r\n}\r\n\r\nfunction setHidden(fields, value) {\r\n    fields.forEach(field => {\r\n        if (fieldList[field]) fieldList[field][\"hidden\"] = value;\r\n    });\r\n}\r\n\r\nfunction setMandatory(fields, value) {\r\n    fields.forEach(field => {\r\n        if (fieldList[field]) fieldList[field][\"mandatory\"] = value;\r\n    });\r\n}\r\n\r\nconsole.log(\"FieldList - End of Postscript (v2 with Quality Review)\", fieldList);\r\n",
    "onSaveScript": "console.info(\"this is an post save/update script ====>\");\r\nconsole.info(\"model====>\", model);\r\n",
    "preScriptEnabled": true,
    "postScriptEnabled": true,
    "isPreScriptSync": false,
    "onSaveScriptEnabled": true
  },
  "validationRules": [
    { "field": "case_id", "rule": "required" },
    { "field": "received_date", "rule": "valid_date" }
  ]
};
