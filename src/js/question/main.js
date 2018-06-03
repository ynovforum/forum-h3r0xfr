const actionBar = $('.question-header .action-right');
const actionsBase = actionBar.html();

// Ouvrir tous les liens dans le contenu de la question et des commentaires dans un nouvel onglet
$('.question-content a, .comment-content a').each((i, el) => {
    $(el).attr('target', '_blank');
});

$('.box .resolved').on('click', resolvedQuestion);
$('.box .answer').on('click', answerQuestion);
$('.box .publish').on('click', publishQuestion);

$('.question-header .edit').on('click', editQuestion);
$('.question-header .delete').on('click', deleteQuestion);
$('#editButton').on('click', saveEditQuestion);

function btnLoad(element, message) {
    element.html('<i class="material-icons material-spin">refresh</i>' + message).attr('disabled', true);
}

function resolvedQuestion() {
    if(confirm('Voulez-vous vraiment marquer cette question comme résolue ?')) {
        const btn = $('.box .resolved');
        const oldContent = btn.html();

        btnLoad(btn, 'Modification de l\'état...');
        btn.parent('form').submit();
    }
}

function answerQuestion() {
    if(tinymce.get('newComment').getContent().length < 1) {
        alert('Vous devez entrer une réponse.');
    } else {
        const btn = $('.box .answer');
        btnLoad(btn, 'Envoi de la réponse...');
        btn.parent('form').submit();
    }
}

function publishQuestion() {
    const btn = $('.box .publish');
    btnLoad(btn, 'Publication de la question...');
    btn.parent('form').submit();
}

function editQuestion() {
    const oldContent = $('.question-content').html();
    $('.question-right').hide();
    $('#edit').show();
    $('#editTitle').show();
    $('.question-content').html('<textarea id="editDescription" class="tinyedit">' + oldContent + '</textarea>');
    tinyReload();
}

function saveEditQuestion() {
    const btn = $('#editButton');
    $('#editTitleField').val($('#editTitle').val());
    $('#editDescriptionField').val(tinymce.get('editDescription').getContent());
    btn.parent('form').submit();
}

function deleteQuestion(e) {
    e.preventDefault();
    if(confirm('Voulez-vous vraiment supprimer la question ? Cette action est irréversible.')) {
        const icon = $('.question-right .delete');
        btnLoad($('.question-right'), 'Suppression de la question...');
        window.location.replace(icon.parent().attr('href'));
    }
}

function tinyReload() {
    tinymce.remove();
    $.getScript('/assets/js/global/tinymce.js');
}
