'use strict';

//create the constructor for the Address book
function AddressBook() {
    this.knownKeys = ['firstName', 'lastName', 'street', 'city', 'state', 'phoneNumber'];
    this.addresses = [];
}

AddressBook.prototype = {
    //create the next empty ID to be populated by the following contact
    newId: function () {
        //if there are no IDs set create ID 1;
        if (this.addresses.length == 0) return 1;
        return (
            //check the last ID set so far and return that ID + 1
            Math.max.apply(null, this.addresses.map(function (address) {
                return address.id;
            })) + 1
        );
    },
    //add a contact function
    addContact: function (contact) {
        //get the last ID created above and
        contact.id = this.newId();
        // populate the rest of the contact details
        this.addresses.push(contact);
    },
    //get a contact function
    getContact: function (id) {
        //search for a contact based the input received
        return this.addresses.find(function (contact) {
            return contact.id === id;
        });
    }
};

function AddressForm() {
    //list of all input field IDs
    this.inputFieldIds = ['firstName', 'lastName', 'street', 'city', 'state', 'phoneNumber'];
}

AddressForm.prototype = {

    collectFormData: function () {
        var output = {};
        //for each of the input fields match the IDs and their values, and add them to the output array;
        this.inputFieldIds.forEach(function (element) {
            output[element] = $('#' + element).val();
        });
        return output;
    },
    //clear for data for a particular ID
    clearFormData: function () {
        //reset all the values to empty
        this.inputFieldIds.forEach(function (element) {
            $('#' + element).val('');
        });
    },
    //validate form data
    validateFormData: function (contact) {
        //if the first name and the last name are empty (!contact.firstName ==> if the first name is not set)
        if (!contact.firstName || !contact.lastName) return false;
        return true;
    }
};

var addressBook = new AddressBook();
var addressForm = new AddressForm();

function prettifyFieldName(name) {
    return name
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, function (str) {
            return str.toUpperCase();
        });
}

function renderContacts(addressBook) {
    $('.contacts-list ul').empty();

    addressBook.addresses.forEach(function (contact) {
        $('.contacts-list ul').append("<li><a href='#' class='show-contact' id='" + contact.id + "-show-contact'>" + contact.firstName + " " + contact.lastName + "</a></li>");
    });
}

function createDetailHtml(addressBook, contact) {
    var html = '';
    addressBook.knownKeys.forEach(function (keyName) {
        if (contact[keyName]) html += "<li><strong>" + prettifyFieldName(keyName) + ": </strong>" + contact[keyName] + "</li>";
    });
    $('#contact-detail-info').html(html);
}

function showError(msg, fadeTime) {
    fadeTime = fadeTime || 2000;
    $('.feedback p').text(msg).fadeIn(1000, function () {
        setTimeout(function () {
            $('.feedback p').fadeOut(1000);
        }, fadeTime);
    });
}

$(function () {

    $('button#add-contact').click(function (e) {
        e.preventDefault();
        var contact = addressForm.collectFormData();

        // validation
        if (addressForm.validateFormData(contact)) {
            addressBook.addContact(contact);
            addressForm.clearFormData();
            renderContacts(addressBook);
        } else {
            showError("You must enter a first and last name.");
        }

    });

    $('.contacts-list').on('click', '.show-contact', function (e) {
        e.preventDefault();
        var contact = addressBook.getContact(parseInt(e.target.id));
        createDetailHtml(addressBook, contact);
    });

});
