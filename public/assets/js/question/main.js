const actionBar=$(".question-header .action-right"),actionsBase=actionBar.html();function btnLoad(e,t){e.html('<i class="material-icons material-spin">refresh</i>'+t).attr("disabled",!0)}function resolvedQuestion(){if(confirm("Voulez-vous vraiment marquer cette question comme résolue ?")){const e=$(".box .resolved");e.html();btnLoad(e,"Modification de l'état..."),e.parent("form").submit()}}function answerQuestion(){if(tinymce.get("newComment").getContent().length<1)alert("Vous devez entrer une réponse.");else{const e=$(".box .answer");btnLoad(e,"Envoi de la réponse..."),e.parent("form").submit()}}function publishQuestion(){const e=$(".box .publish");btnLoad(e,"Publication de la question..."),e.parent("form").submit()}function editQuestion(){const e=$(".question-content").html();$(".question-right").hide(),$("#edit").show(),$("#editTitle").show(),$(".question-content").html('<textarea id="editDescription" class="tinyedit">'+e+"</textarea>"),tinyReload()}function saveEditQuestion(){const e=$("#editButton");$("#editTitleField").val($("#editTitle").val()),$("#editDescriptionField").val(tinymce.get("editDescription").getContent()),e.parent("form").submit()}function deleteQuestion(e){if(e.preventDefault(),confirm("Voulez-vous vraiment supprimer la question ? Cette action est irréversible.")){const e=$(".question-right .delete");btnLoad($(".question-right"),"Suppression de la question..."),window.location.replace(e.parent().attr("href"))}}function tinyReload(){tinymce.remove(),$.getScript("/assets/js/global/tinymce.js")}$(".question-content a, .comment-content a").each((e,t)=>{$(t).attr("target","_blank")}),$(".box .resolved").on("click",resolvedQuestion),$(".box .answer").on("click",answerQuestion),$(".box .publish").on("click",publishQuestion),$(".question-header .edit").on("click",editQuestion),$(".question-header .delete").on("click",deleteQuestion),$("#editButton").on("click",saveEditQuestion);