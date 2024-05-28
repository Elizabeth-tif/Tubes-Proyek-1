//a function to filter the data based on the filters selected
function filter() {
	var type = document.getElementById("type-selector").value;
	var snpmb = document.getElementById("snpmb-selector").value;
	var year = document.getElementById("year-selector").value;
	var URL;
	var title =
		"Tabel Peminat dan Daya Tampung Prodi di " +
		(type == "all_type" ? "PTN" : type) +
		" di " +
		snpmb +
		" Tahun " +
		year;
	document.getElementById("table-title").innerHTML = title;
	if (snpmb == "SNBP") {
		URL = "assets/data/clean_SNBP.json";
	} else {
		URL = "assets/data/clean_SNBT.json";
	}

	if ($.fn.DataTable.isDataTable("#datatable")) {
		$("#datatable").DataTable().destroy();
	}
	datatable = $("#datatable").DataTable({
		ajax: { url: URL, dataSrc: "" },
		scrollX: true,
		order: [[6, "desc"]],
		columns: [
			{
				data: "Provinsi_Asal_PTN",
				orderable: true,
				orderSequence: ["asc", "desc"],
			},
			{
				data: "Type_PTN",
				orderable: false,
			},
			{
				data: "Nama_PTN",
				orderable: true,
				orderSequence: ["asc", "desc"],
			},
			{
				data: "Kode_Prodi",
				orderable: false,
			},
			{
				data: "Prodi",
				orderable: false,
			},
			{
				data: "Jenjang",
				orderable: false,
			},
			{
				data: "Jumlah_Peminat_" + year,
				orderable: true,
				orderSequence: ["asc", "desc"],
			},
			{
				data: "Daya_Tampung_" + year,
				orderable: true,
				orderSequence: ["asc", "desc"],
			},
			{
				data: "Persen_Daya_Tampung_" + year,
				orderable: true,
				orderSequence: ["asc", "desc"],
				render: function (data, type, row) {
					return (data * 100).toFixed(2) + "%";
				},
			},
		],
		initComplete: function (settings, json) {
			var datatable = this.api();
			datatable.rows().every(function (rowIdx, tableLoop, rowLoop) {
				var PTNType = datatable.cell(rowIdx, 1).data();

				if (type === "all_type" || PTNType.includes(type)) {
					//do nothing
				} else {
					datatable.row(rowIdx).remove();
				}
			});
			datatable.draw();
			addSearchElement();
		},
	});
}

document.addEventListener("DOMContentLoaded", filter);

function addSearchElement() {
	let searchElement = document.querySelector("#datatable_wrapper .dt-search");
	var secondChild = searchElement.children[1];

	secondChild.addEventListener("focus", function () {
		searchElement.classList.add("is-focused");
	})

	secondChild.addEventListener("focusout", function () {
		searchElement.classList.remove("is-focused");
	})

	searchElement.classList.add("input-group", "input-group-dynamic", "mb-4");
	searchElement.firstChild.innerHTML = "Search"
	searchElement.firstChild.classList.add("form-label");
	secondChild.classList.remove("form-control-sm");
}