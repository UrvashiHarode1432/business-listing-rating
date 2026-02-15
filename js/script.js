$(document).ready(function () {

    const basePath = 'images/';

    var ratyDefaults = {
        starType: 'img',
        starOff: basePath + 'star-off.png',
        starOn: basePath + 'star-on.png',
        starHalf: basePath + 'star-half.png',
    };
    function esc(s) { return $('<div>').text(s || '').html(); }

    //readonly Average rating
    $('#business-table .avg-rating').each(function () {
        var score = $(this).data('score');
        $(this).raty({
            ...ratyDefaults,
            readOnly: true,
            half: true,
            score: score,
        });
    });

    // Initialize rating when modal opens
    $('#rating-modal').on('shown.bs.modal', function () {

        if ($('#modal-rating').data('raty')) {
            $('#modal-rating').raty('destroy');
            $('#modal-rating').empty();
        }
        $('#modal-rating').removeData('score').removeAttr('data-score');

        $('#modal-rating').raty({
            ...ratyDefaults,
            path: '',
            scoreName: 'rating',
            number: 5,
            half: true,
            score: 0,
        });

    });

    //reset modal
    $('#rating-modal').on('hidden.bs.modal', function () {

        $('#modal-alert').addClass('d-none').text('');
        $('#rating-form')[0].reset();
        try {
            $('#modal-rating').raty('destroy');
        } catch (e) { }
        $('#modal-rating').empty();
    });

    //get business id
    $(document).on('click', '.rate-btn', function () {
        var businessId = $(this).data('id');
        var businessName = $(this).data('name');
        $('#modal-business-id').val(businessId);
        $('#modal-business-name').text(businessName);
    });

    //submit rating
    $('#rating-form').on('submit', function (e) {
        e.preventDefault();
        var $btn = $('#submit-rating').prop('disabled', true);

        $.ajax({
            url: 'submit_rating.php',
            type: 'POST',
            data: $(this).serialize(),
            dataType: 'json',
            success: function (response) {
                if (response.status === "success") {
                    var businessId = response.business_id;
                    var newAverage = parseFloat(response.average_rating);
                    $('#total-rating-' + businessId)
                        .text(response.total_ratings);
                    $('#avg-rating-text-' + businessId)
                        .text(newAverage.toFixed(1));
                    var avgCell = $('#avg-rating-' + businessId);
                    if (avgCell.data('raty')) {
                        avgCell.raty('destroy');
                    }
                    avgCell.empty();
                    avgCell.attr('data-score', newAverage);
                    avgCell.removeData('score');
                    avgCell.raty($.extend({},
                        ratyDefaults,
                        { path: '', readOnly: true, half: true, halfShow: true, precision: true, score: newAverage }));
                    let businessName = $('#modal-business-name').text();
                    $('#rating-modal').modal('hide');
                    $('#global-alert')
                        .removeClass('d-none alert-danger')
                        .addClass('alert-success')
                        .text('Rating submitted successfully for ' + businessName)
                        .fadeIn();
                    setTimeout(function () {
                        $('#rating-modal').modal('hide');
                        $('#global-alert').fadeOut();
                    }, 9000);
                }
                else if (response.status === 'error') {
                    $('#modal-alert')
                        .removeClass('d-none alert-success')
                        .addClass('alert-danger')
                        .text(response.message)
                        .fadeIn();
                    setTimeout(function () {
                        $('#modal-alert').fadeOut();
                    }, 3000);
                    return;
                }
            },
            error: function (xhr) {
                $('#global-alert')
                    .removeClass('d-none alert-success')
                    .addClass('alert-warning')
                    .text('Something went wrong.')
                    .fadeIn();
                return;
            },
            complete: function () { $btn.prop('disabled', false); }
        });
    });

    // Open Edit Modal
    $(document).on('click', '.edit-btn', function () {
        $('#modalTitle').text('Edit Business');
        $('#business-id').val($(this).data('id'));
        $('#business-name').val($(this).data('name'));
        $('#business-address').val($(this).data('address'));
        $('#business-phone').val($(this).data('phone'));
        $('#business-email').val($(this).data('email'));
        $('#businessModal').modal('show');
    });

    // Open Add Modal
    $('#addBusinessBtn').on('click', function () {
        $('#modalTitle').text('Add Business');
        $('#business-form')[0].reset();
        $('#business-id').val('');
        $('#businessModal').modal('show');
    });


    // Submit Create / Update
    $('#business-form').on('submit', function (e) {
        e.preventDefault();
        let id = $('#business-id').val();
        let action = id ? "update" : "create";
        $.ajax({
            url: 'business_action.php',
            type: 'POST',
            data: $(this).serialize() + '&action=' + action,
            dataType: 'json',
            success: function (response) {
                if (response.status === "success") {
                    var id = response.id;
                    var newRow = `
                        <tr id="row-${id}">
                            <td>${id}</td>
                            <td>${$('#business-name').val()}</td>
                            <td>${$('#business-address').val()}</td>
                            <td>${$('#business-phone').val()}</td>
                            <td>${$('#business-email').val()}</td>
                            <td>
                                <button class="btn btn-warning edit-btn"
                                    data-id="${id}"
                                    data-name="${$('#business-name').val()}"
                                    data-address="${$('#business-address').val()}"
                                    data-phone="${$('#business-phone').val()}"
                                    data-email="${$('#business-email').val()}">
                                    Edit
                                </button>
                                <button class="btn btn-danger delete-btn"
                                    data-id="${id}">
                                    Delete
                                </button>
                            </td>
                            <td>
                                <div class="rating-wrapper">
                                    <span id="avg-rating-text-${id}" 
                                        class="rating-number">0.0</span>
                                    <div id="avg-rating-${id}" 
                                        class="avg-rating" 
                                        data-score="0"></div>
                                </div>
                            </td>
                            <td id="total-rating-${id}">0</td>
                            <td>
                                <button type="button" 
                                    class="btn btn-primary rate-btn"
                                    data-toggle="modal"
                                    data-target="#rating-modal"
                                    data-id="${id}"
                                    data-name="${$('#business-name').val()}">
                                    Rate Us
                                </button>
                            </td>
                        </tr>`;

                    $('#business-table tbody').append(newRow);
                    $('#avg-rating-' + id).raty($.extend({}, ratyDefaults, { readOnly: true, half: true, score: 0 }));
                    $('#businessModal').modal('hide');
                    $('#global-alert')
                        .removeClass('d-none alert-danger')
                        .addClass('alert-success')
                        .text('New Business Added Successfully')
                        .fadeIn();
                    setTimeout(function () {
                        $('#global-alert').fadeOut();
                    }, 3000);
                }
                else if (response.status === "updated") {
                    var id = $('#business-id').val();
                    var row = $('#row-' + id);
                    var name = $('#business-name').val();
                    var address = $('#business-address').val();
                    var phone = $('#business-phone').val();
                    var email = $('#business-email').val();

                    row.find('td:eq(1)').text(name);
                    row.find('td:eq(2)').text(address);
                    row.find('td:eq(3)').text(phone);
                    row.find('td:eq(4)').text(email);
                    row.find('.edit-btn').data({ name: name, address: address, phone: phone, email: email });

                    $('#businessModal').modal('hide');
                    $('#global-alert')
                        .removeClass('d-none alert-danger')
                        .addClass('alert-success')
                        .text('Business Updated Successfully')
                        .fadeIn();
                    setTimeout(function () {
                        $('#global-alert').fadeOut();;
                    }, 3000);
                }
                else if (response.status === "error") {
                    $('#business-modal-alert')
                        .removeClass('d-none alert-success')
                        .addClass('alert-danger')
                        .text(response.message)
                        .fadeIn();
                    setTimeout(function () {
                        $('#business-modal-alert').fadeOut();;
                    }, 3000);

                    $('#businessModal').on('hidden.bs.modal', function () {
                        $('#business-modal-alert')
                            .addClass('d-none')
                            .text('');
                    });
                    return;
                }
            }
        });
    });

    // Delete
    $(document).on('click', '.delete-btn', function () {
        if (!confirm("Are you sure?")) return;
        let id = $(this).data('id');
        $.ajax({
            url: 'business_action.php',
            type: 'POST',
            data: { id: id, action: "delete" },
            dataType: 'json',
            success: function (response) {
                if (response.status === "deleted") {
                    $('#row-' + id).remove();
                    $('#global-alert')
                        .removeClass('d-none alert-danger')
                        .addClass('alert-success')
                        .text('Business Deleted successfully')
                        .fadeIn();
                    setTimeout(function () {
                        $('#global-alert').fadeOut();
                    }, 3000);
                }
            }
        });
    });
});
