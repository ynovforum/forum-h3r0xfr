const actionBar = $('.question-header .action-right');
const actionsBase = actionBar.html();

$('.question-header .resolved').on('click', resolvedQuestion);
$('.question-header .edit').on('click', editQuestion);
$('.question-header .delete').on('click', deleteQuestion);

function resolvedQuestion() {
    if(confirm('Voulez-vous vraiment marquer cette question comme résolue ?')) {
        alert('Question résolue.');
    }
}

function editQuestion() {
    const oldContent = $('.question-content').html();
    actionBar.html('En cours d\'édition');
    $('#editTitle').show();
    $('.question-content').html('<textarea class="tinyedit">' + oldContent + '</textarea>');
    tinyReload();
}

function deleteQuestion() {
    if(confirm('Voulez-vous vraiment supprimer cette question ?')) {
        alert('Question supprimée.');
    }
}

function tinyReload() {
    tinymce.remove();
    $.getScript('/assets/js/global/tinymce.js');
}
