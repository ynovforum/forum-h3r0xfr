const actionBar = $('.question-header .action-right');
const actionsBase = actionBar.html();
//const savedContent = [];

// Ouvrir tous les liens dans le contenu de la question et des commentaires dans un nouvel onglet
$('.question-content a, .comment-content a').each((i, el) => {
    $(el).attr('target', '_blank');
});

$('.box .resolved').on('click', resolvedQuestion);
$('.box .answer').on('click', answerQuestion);
$('.box .publish').on('click', publishQuestion);

$('.question-header .edit').on('click', editQuestion);
$('.question-header .delete').on('click', deleteQuestion);

function btnLoad(element, message) {
    /*savedContent.push(element);
    savedContent[element] = element.html();*/
    element.html('<i class="material-icons material-spin">refresh</i>' + message).attr('disabled', true);
}

/*function btnReset(element) {
    element.html(savedContent[element]).attr('disabled', false);
}*/

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
    actionBar.html('En cours d\'édition');
    $('#editTitle').show();
    $('.question-content').html('<textarea class="tinyedit">' + oldContent + '</textarea>');
    tinyReload();
}

function deleteQuestion() {
    if(confirm('Voulez-vous vraiment supprimer la question ? Cette action est irréversible.')) {
        alert('Question supprimée.');
    }
}

function tinyReload() {
    tinymce.remove();
    $.getScript('/assets/js/global/tinymce.js');
}
