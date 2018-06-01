$('.box-row').each((index, element) => {
    let randomColor = '#'+ ('000000' + Math.floor(Math.random()*16777215).toString(16)).slice(-6);
    $(element).css('border-left', '4px solid ' + randomColor);
});
