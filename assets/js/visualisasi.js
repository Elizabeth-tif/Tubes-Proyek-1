// Search PTN chart visualization
let searchPeminatChart;
let searchDayaTampungChart;
let perbandinganChart;
let snpmbType = document.getElementById("snpmb-type-selector").value;
let PTNName;

document.addEventListener("DOMContentLoaded", function () {
	const searchInput = document.getElementById("search-input");
	const resultsContainer = document.getElementById("results");
	const univName = document.getElementById("univName");
    const canvas1 = document.getElementById("searchPeminatChart");
    const canvas2 = document.getElementById("searchDayaTampungChart");
    const canvas3 = document.getElementById("perbandinganChart");
	let url;
	let universities = [];

    if (!searchInput.value) {
        canvas1.style.display = "none";
        canvas2.style.display = "none";
        canvas3.style.display = "none";   
    }

	// Function untuk display result
	function displayResults(results) {
		resultsContainer.innerHTML = "";
		const limitedResults = results.slice(0, 8); // Membatasi Result jadi 5
		limitedResults.forEach((result) => {
			const li = document.createElement("li");
            const h6 = document.createElement("h6");
			li.classList.add("result-item", "list-group-item", "border-0", "px-4", "py-2");
            li.appendChild(h6);
            h6.classList.add("m-0");
            h6.textContent = result.Nama_PTN;

			// Add click event listener buat setiap result item
			li.addEventListener("click", function () {
				PTNName = result.Nama_PTN;
				canvas1.style.display = "block";
				canvas2.style.display = "block";
				canvas3.style.display = "block";
				changeUniv(PTNName);
			});
			resultsContainer.appendChild(li);
		});
	}

	// Function to search universities
	function searchUniversities(query) {
		const filteredResults = universities.filter((uni) =>
			uni.Nama_PTN.toLowerCase().includes(query.toLowerCase())
		);
		displayResults(filteredResults);
	}

	// Event listener for input
	searchInput.addEventListener("input", function () {
		const query = searchInput.value;
		if (query) {
			searchUniversities(query);
		} else {
			resultsContainer.innerHTML = "";
		}
	});

	// Event listener for dropdown change
	document
		.getElementById("snpmb-type-selector")
		.addEventListener("change", function () {
			snpmbType = document.getElementById("snpmb-type-selector").value;
			universityList();
			setTimeout(function () {
				changeUniv(PTNName);
			}, 100);
		});

	// Function untuk fetch dan process data
	async function universityList() {
		if (snpmbType === "SNBP") {
			url = "../assets/data/PTN_SNBP.json";
		} else if (snpmbType === "SNBT") {
			url = "../assets/data/PTN_SNBT.json";
		}

		try {
			const response = await fetch(url);
			const data = await response.json();
			universities = data.map((ptn) => ({
				Nama_PTN: ptn.Nama_PTN,
				JP_2019: ptn.Jumlah_Peminat_2019,
				DT_2019: ptn.Daya_Tampung_2019,
				JP_2020: ptn.Jumlah_Peminat_2020,
				DT_2020: ptn.Daya_Tampung_2020,
				JP_2021: ptn.Jumlah_Peminat_2021,
				DT_2021: ptn.Daya_Tampung_2021,
				JP_2022: ptn.Jumlah_Peminat_2022,
				DT_2022: ptn.Daya_Tampung_2022,
				JP_2023: ptn.Jumlah_Peminat_2023,
				DT_2023: ptn.Daya_Tampung_2023,
			}));
			console.log("Data:", universities);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	}

	// Function untuk ganti chart universitas
	function changeUniv(name) {
		univName.textContent = name;
		searchInput.value = "";
		resultsContainer.innerHTML = "";

		// Find the university object with the matching name and log it
		const university = universities.find((uni) => uni.Nama_PTN === name);
		if (university) {
			univVisualization(university);
		}
	}

	// Memanggil function buat fetch data
	universityList();
});

// Function buat bikin chart
function univVisualization(univ) {
	if (searchPeminatChart) {
		searchPeminatChart.destroy();
	}
	if (searchDayaTampungChart) {
		searchDayaTampungChart.destroy();
	}
	if (perbandinganChart) {
		perbandinganChart.destroy();
	}

	searchPeminatChart = new Chart("searchPeminatChart", {
		type: "bar",
		data: {
			labels: [
				"Jumlah Peminat 2019",
				"Jumlah Peminat 2020",
				"Jumlah Peminat 2021",
				"Jumlah Peminat 2022",
				"Jumlah Peminat 2023",
			],
			datasets: [
				{
					label: "Jumlah Peminat",
					data: [
						univ.JP_2019,
						univ.JP_2020,
						univ.JP_2021,
						univ.JP_2022,
						univ.JP_2023,
					],
					backgroundColor: "rgba(99, 179, 237, 1)",
					
				},
			],
		},
		options: {
			plugins: {
				title: {
					display: true,
					text:
						"Jumlah Peminat " +
						univ.Nama_PTN +
						" di " +
						snpmbType +
						" Tahun 2019-2023",
				},
			},
		},
	});

	searchDayaTampungChart = new Chart("searchDayaTampungChart", {
		type: "bar",
		data: {
			labels: [
				"Daya Tampung 2019",
				"Daya Tampung 2020",
				"Daya Tampung 2021",
				"Daya Tampung 2022",
				"Daya Tampung 2023",
			],
			datasets: [
				{
					label: "Daya Tampung",
					data: [
						univ.DT_2019,
						univ.DT_2020,
						univ.DT_2021,
						univ.DT_2022,
						univ.DT_2023,
					],
					backgroundColor: "rgba(99, 179, 237, 1)",
					
				},
			],
		},
		options: {
			plugins: {
				title: {
					display: true,
					text:
						"Daya Tampung " +
						univ.Nama_PTN +
						" di " +
						snpmbType +
						" Tahun 2019-2023",
				},
			},
		},
	});

	perbandinganChart = new Chart("perbandinganChart", {
		type: "bar",
		data: {
			labels: ["2019", "2020", "2021", "2022", "2023"],
			datasets: [
				{
					label: "Jumlah Peminat",
					data: [
						univ.JP_2019,
						univ.JP_2020,
						univ.JP_2021,
						univ.JP_2022,
						univ.JP_2023,
					],
					backgroundColor: "rgba(99, 179, 237, 1)",
					
				},
				{
					label: "Daya Tampung",
					data: [
						univ.DT_2019,
						univ.DT_2020,
						univ.DT_2021,
						univ.DT_2022,
						univ.DT_2023,
					],
					backgroundColor: "rgba(251, 140, 0, 1)",
					borderColor: "rgba(153, 102, 255, 1)",
				},
			],
		},
		options: {
			plugins: {
				title: {
					display: true,
					text:
						"Perbandingan Jumlah Peminat dan Daya Tampung " +
						univ.Nama_PTN +
						" di " +
						snpmbType +
						" Tahun 2019-2023",
				},
			},
		},
	});
}
// Search PTN chart visualization END

// Rest of Visualization
let peminatChart;
let dayaTampungChart;
let keketatanChart;
let peminatBidangChart;
let dayaTampungBidangChart;
let keketatanBidangChart;

async function visualizeDataPTN() {
	let year = document.getElementById("year-selector").value;
	let snpmb = document.getElementById("snpmb-selector").value;
	let ptnType = document.getElementById("PTN-selector").value;
	let chartType = document.getElementById("chart-type").value;
	let peminatArray = [];
	let dayaTampungArray = [];
	let keketatanArray = [];
	let colorArray1 = ["#FFADAD", "#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BF6FF"];
	let colorArray2 = ["#A0C4FF", "#BDB2FF", "#FFC6FF", "#FFAFCC", "#BDE0FE"];
	let colorArray3 = ["#A2D2FF", "#FF9B54", "#F77F00", "#F71735", "#5E60CE"];

	try {
		const response = await fetch("../assets/data/dataset_1.json");
		const data = await response.json();
		peminatArray = data.map((ptn) => ({
			Nama_PTN: ptn[`TOP_${ptnType}_${snpmb}_${year}`],
			JP: ptn[`JUMLAH_PEMINAT_${ptnType}_${snpmb}_${year}`],
		}));
	} catch (error) {
		console.error("Error fetching data:", error);
	}

	try {
		const response = await fetch("../assets/data/dataset_2.json");
		const data = await response.json();
		dayaTampungArray = data.map((ptn) => ({
			Nama_PTN: ptn[`TOP_${ptnType}_${snpmb}_${year}`],
			DT: ptn[`JUMLAH_DAYA_TAMPUNG_${ptnType}_${snpmb}_${year}`],
		}));
	} catch (error) {
		console.error("Error fetching data:", error);
	}

	try {
		const response = await fetch("../assets/data/dataset_3.json");
		const data = await response.json();
		keketatanArray = data.map((ptn) => ({
			Nama_PTN: ptn[`TOP_${ptnType}_${snpmb}_${year}`],
			KT: ptn[`KEKETATAN_${ptnType}_${snpmb}_${year}`],
		}));
	} catch (error) {
		console.error("Error fetching data:", error);
	}

	if (peminatChart) {
		peminatChart.destroy();
	}

	if (dayaTampungChart) {
		dayaTampungChart.destroy();
	}

	if (keketatanChart) {
		keketatanChart.destroy();
	}

	peminatChart = new Chart("jp-chart", {
		type: chartType,
		data: {
			labels: peminatArray.map((ptn) => ptn.Nama_PTN),
			datasets: [
				{
					label: "Jumlah Peminat",
					data: peminatArray.map((ptn) => ptn.JP),
					backgroundColor:
						chartType == "pie"
							? colorArray1
							: "rgba(99, 179, 237, 1)",
					
				},
			],
		},
		options: {
			plugins: {
				title: {
					display: true,
					text:
						"Top 5 PTN " +
						ptnType +
						" di " +
						snpmb +
						" di tahun " +
						year +
						" berdasarkan Jumlah Peminat",
				},
			},
		},
	});

	dayaTampungChart = new Chart("dt-chart", {
		type: chartType,
		data: {
			labels: dayaTampungArray.map((ptn) => ptn.Nama_PTN),
			datasets: [
				{
					label: "Daya Tampung",
					data: dayaTampungArray.map((ptn) => ptn.DT),
					backgroundColor:
						chartType == "pie"
							? colorArray2
							: "rgba(99, 179, 237, 1)",
					
				},
			],
		},
		options: {
			plugins: {
				title: {
					display: true,
					text:
						"Top 5 PTN " +
						ptnType +
						" di " +
						snpmb +
						" di tahun " +
						year +
						" berdasarkan Daya Tampung",
				},
			},
		},
	});

	keketatanChart = new Chart("kt-chart", {
		type: chartType,
		data: {
			labels: keketatanArray.map((ptn) => ptn.Nama_PTN),
			datasets: [
				{
					label: "Keketatan",
					data: keketatanArray.map((ptn) => ptn.KT),
					backgroundColor:
						chartType == "pie"
							? colorArray3
							: "rgba(99, 179, 237, 1)",
					
				},
			],
		},
		options: {
			plugins: {
				title: {
					display: true,
					text:
						"Top 5 PTN " +
						ptnType +
						" di " +
						snpmb +
						" di tahun " +
						year +
						" berdasarkan Keketatan",
				},
			},
		},
	});
}

async function visualizeDataMajor() {
	let year = document.getElementById("year-selector-2").value;
	let snpmb = document.getElementById("snpmb-selector-2").value;
	let chartType = document.getElementById("chart-type-2").value;
	let peminatArray = [];
	let dayaTampungArray = [];
	let keketatanArray = [];

	let colorArray1 = ["#FFADAD", "#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BF6FF"];
	let colorArray2 = ["#A0C4FF", "#BDB2FF", "#FFC6FF", "#FFAFCC", "#BDE0FE"];
	let colorArray3 = ["#A2D2FF", "#FF9B54", "#F77F00", "#F71735", "#5E60CE"];

	try {
		const response = await fetch("../assets/data/dataset_4.json");
		const data = await response.json();
		peminatArray = data.map((ptn) => ({
			Nama_Bidang_Ilmu: ptn[`BIDANG_ILMU_PEMINAT_${snpmb}_${year}`],
			JP: ptn[`JUMLAH_PEMINAT_${snpmb}_${year}`],
		}));
	} catch (error) {
		console.error("Error fetching data:", error);
	}

	try {
		const response = await fetch("../assets/data/dataset_5.json");
		const data = await response.json();
		dayaTampungArray = data.map((ptn) => ({
			Nama_Bidang_Ilmu: ptn[`BIDANG_ILMU_TAMPUNG_${snpmb}_${year}`],
			DT: ptn[`DAYA_TAMPUNG_${snpmb}_${year}`],
		}));
	} catch (error) {
		console.error("Error fetching data:", error);
	}

	try {
		const response = await fetch("../assets/data/dataset_6.json");
		const data = await response.json();
		keketatanArray = data.map((ptn) => ({
			Nama_Bidang_Ilmu: ptn[`BIDANG_ILMU_KEKETATAN_${snpmb}_${year}`],
			KT: ptn[`DAYA_KEKETATAN_${snpmb}_${year}`],
		}));
	} catch (error) {
		console.error("Error fetching data:", error);
	}

	if (peminatBidangChart) {
		peminatBidangChart.destroy();
	}

	if (dayaTampungBidangChart) {
		dayaTampungBidangChart.destroy();
	}

	if (keketatanBidangChart) {
		keketatanBidangChart.destroy();
	}

	peminatBidangChart = new Chart("jp-bidang-chart", {
		type: chartType,
		data: {
			labels: peminatArray.map((ptn) => ptn.Nama_Bidang_Ilmu),
			datasets: [
				{
					label: "Jumlah Peminat",
					data: peminatArray.map((ptn) => ptn.JP),
					backgroundColor:
						chartType == "pie"
							? colorArray1
							: "rgba(99, 179, 237, 1)",
					
				},
			],
		},
		options: {
			plugins: {
				title: {
					display: true,
					text:
						"Top 5 Bidang Ilmu di " +
						snpmb +
						" di tahun " +
						year +
						" berdasarkan Jumlah Peminat",
				},
			},
		},
	});

	dayaTampungBidangChart = new Chart("dt-bidang-chart", {
		type: chartType,
		data: {
			labels: dayaTampungArray.map((ptn) => ptn.Nama_Bidang_Ilmu),
			datasets: [
				{
					label: "Daya Tampung",
					data: dayaTampungArray.map((ptn) => ptn.DT),
					backgroundColor:
						chartType == "pie"
							? colorArray2
							: "rgba(99, 179, 237, 1)",
					
				},
			],
		},
		options: {
			plugins: {
				title: {
					display: true,
					text:
						"Top 5 Bidang Ilmu di " +
						snpmb +
						" di tahun " +
						year +
						" berdasarkan Daya Tampung",
				},
			},
		},
	});

	keketatanBidangChart = new Chart("kt-bidang-chart", {
		type: chartType,
		data: {
			labels: keketatanArray.map((ptn) => ptn.Nama_Bidang_Ilmu),
			datasets: [
				{
					label: "Keketatan",
					data: keketatanArray.map((ptn) => ptn.KT),
					backgroundColor:
						chartType == "pie"
							? colorArray3
							: "rgba(99, 179, 237, 1)",
					
				},
			],
		},
		options: {
			plugins: {
				title: {
					display: true,
					text:
						"Top 5 Bidang Ilmu di " +
						snpmb +
						" di tahun " +
						year +
						" berdasarkan Keketatan",
				},
			},
		},
	});
}

document.addEventListener("DOMContentLoaded", visualizeDataPTN);
document.addEventListener("DOMContentLoaded", visualizeDataMajor);
// Rest of Visualization END
