$(document).ready(function () {

    const basePath = 'images/';

    //readonly Average rating
    $('#business-table .avg-rating').each(function () {
        var score = $(this).data('score');
        $(this).raty({
            starType: 'img',
            starOff: basePath + 'star-off.png',
            starOn: basePath + 'star-on.png',
            starHalf: basePath + 'star-half.png',
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
        // Clear cached score so stars always start empty
        $('#modal-rating').removeData('score').removeAttr('data-score');

        $('#modal-rating').raty({
            starType: 'img',
            path: '',
            starOff: basePath + 'star-off.png',
            starOn: basePath + 'star-on.png',
            starHalf: basePath + 'star-half.png',
            scoreName: 'rating',
            number: 5,
            half: true,
            score: 0,
            click: function (score) {
                $('#modal-rating-value').val(score);
            }
        });

    });

    //reset modal
    $('#rating-modal').on('hidden.bs.modal', function () {

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

                    // Reinitialize with NEW score
                    avgCell.raty({
                        starType: 'img',
                        path: '',
                        starOff: basePath + 'star-off.png',
                        starOn: basePath + 'star-on.png',
                        starHalf: basePath + 'star-half.png',
                        readOnly: true,
                        half: true,
                        halfShow: true,
                        precision: true,
                        score: newAverage
                    });
                    $('#rating-modal').modal('hide');
                }

            },
            error: function () {
                alert('Something went wrong');
            }
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

                    let id = response.id;

                    let newRow = `
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

                    $('#avg-rating-' + id).raty({
                        starType: 'img',
                        starOff: basePath + 'star-off.png',
                        starOn: basePath + 'star-on.png',
                        starHalf: basePath + 'star-half.png',
                        readOnly: true,
                        half: true,
                        score: 0
                    });

                    $('#businessModal').modal('hide');
                }


                if (response.status === "updated") {

                    let id = $('#business-id').val(); // ADD THIS LINE

                    let row = $('#row-' + id);

                    row.find('td:eq(1)').text($('#business-name').val());
                    row.find('td:eq(2)').text($('#business-address').val());
                    row.find('td:eq(3)').text($('#business-phone').val());
                    row.find('td:eq(4)').text($('#business-email').val());

                    let editBtn = row.find('.edit-btn');

                    editBtn.data('name', $('#business-name').val());
                    editBtn.data('address', $('#business-address').val());
                    editBtn.data('phone', $('#business-phone').val());
                    editBtn.data('email', $('#business-email').val());
                }

                $('#businessModal').modal('hide');
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
                }
            }
        });
    });

});
