//a function to filter the data based on the filters selected
function filterProdi() {
	var type = document.getElementById("type-selector").value;
	var snpmb = document.getElementById("snpmb-selector").value;
	var year = document.getElementById("year-selector").value;
	var prov = document.getElementById("prov-selector").value;
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
		URL = "../assets/data/clean_SNBP.json";
	} else {
		URL = "../assets/data/clean_SNBT.json";
	}

	if ($.fn.DataTable.isDataTable("#datatable_Prodi")) {
		$("#datatable_Prodi").DataTable().destroy();
	}
	datatable = $("#datatable_Prodi").DataTable({
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
				var PTNProv = datatable.cell(rowIdx, 0).data();
				if (
					(type === "all_type" || PTNType.includes(type)) &&
					(prov === "all_prov" || PTNProv.includes(prov))
				) {
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

function filterPTN() {
	var type = document.getElementById("type-ptn-selector").value;
	var snpmb = document.getElementById("snpmb-ptn-selector").value;
	var year = document.getElementById("year-ptn-selector").value;
	var URL;
	var title =
		"Tabel Peminat dan Daya Tampung di " +
		(type == "all_type" ? "PTN" : type) +
		" di " +
		snpmb +
		" Tahun " +
		year;
	document.getElementById("table-ptn-title").innerHTML = title;
	if (snpmb == "SNBP") {
		URL = "../assets/data/PTN_SNBP.json";
	} else {
		URL = "../assets/data/PTN_SNBT.json";
	}

	if ($.fn.DataTable.isDataTable("#datatable_PTN")) {
		$("#datatable_PTN").DataTable().destroy();
	}
	datatable = $("#datatable_PTN").DataTable({
		ajax: { url: URL, dataSrc: "" },
		scrollX: true,
		columnDefs: [
			{
				targets: "_all",
				className: "dt-head-left",
			},
		],
		columns: [
			{
				data: "Provinsi",
				orderable: true,
				orderSequence: ["asc", "desc"],
			},
			{
				data: "Jenis_PTN",
				orderable: false,
			},
			{
				data: "Nama_PTN",
				orderable: false,
			},
			{
				data: "Jumlah_Prodi",
				orderable: true,
				orderSequence: ["asc", "desc"],
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
				data: "Keketatan_" + year,
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
		},
	});
}

document.addEventListener("DOMContentLoaded", filterProdi);
document.addEventListener("DOMContentLoaded", filterPTN);

function addSearchElement() {
	let searchElement = [];
	searchElement.push(
		document.querySelector("#datatable_Prodi_wrapper .dt-search")
	);
	searchElement.push(
		document.querySelector("#datatable_PTN_wrapper .dt-search")
	);
	let secondChild = [];
	secondChild.push(searchElement[0].children[1]);
	secondChild.push(searchElement[1].children[1]);

	for (let index = 0; index < searchElement.length; index++) {
		secondChild[index].addEventListener("focus", function () {
			searchElement[index].classList.add("is-focused");
		});

		secondChild[index].addEventListener("focusout", function () {
			searchElement[index].classList.remove("is-focused");
		});

		searchElement[index].classList.add(
			"input-group",
			"input-group-dynamic",
			"mb-4"
		);
		searchElement[index].firstChild.innerHTML = "Search";
		searchElement[index].firstChild.classList.add("form-label");
		secondChild[index].classList.remove("form-control-sm");
	}
}
