tinymce.init({
    selector: '.tinyedit',
    language: 'fr_FR',
    height: 300,
    plugins: 'advlist autolink link image lists charmap print preview'
});

tinymce.init({
    selector: '.tinycomment',
    language: 'fr_FR',
    height: 150,
    theme: 'modern',
    menubar: false,
    plugins: 'advlist autolink link image lists charmap print preview'
});
