function preview(input) {
    if(input.files && input.files[0]) {
       let reader = new FileReader();

       reader.onload = (e) => {
           $('.avatar.profile').attr('src', e.target.result);
       };

       reader.readAsDataURL(input.files[0]);
    }
}
