document.addEventListener("DOMContentLoaded", () => {
  const detailsBox = document.getElementById("product-details");
  const tableBody = document.getElementById("table-body");

  // data.json 로드
  fetch("data.json")
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load JSON data");
      return res.json();
    })
    .then((data) => {
      const item = data["ProductCertificationInfo"];
      if (!item) {
        throw new Error("Invalid or missing certification data structure");
      }

      // 1. 제품 및 모델명 정보 바인딩
      detailsBox.innerHTML = `
        <strong>Name:</strong> ${item.name || "-"}<br>
        <strong>Model No:</strong> ${item.model || "-"}
      `;

      // 2. 테이블 데이터 채우기
      tableBody.innerHTML = ""; // 기존 스켈레톤/비어있음 영역 제거
      const certNames = item.certificationNames || [];
      const certInfos = item.certificationInfos || [];
      const logos = item.certificationLogos || [];

      // 배열 중 최장 길이를 기준으로 처리
      const maxLength = Math.max(certNames.length, certInfos.length, logos.length);

      for (let i = 0; i < maxLength; i++) {
        const certName = certNames[i] || "";
        const certInfo = certInfos[i] || "-";
        const logoFile = logos[i] ? logos[i].toString().trim() : "-";

        const row = document.createElement("tr");

        // 인증 번호 셀
        const tdCert = document.createElement("td");
        tdCert.textContent = certInfo;

        // 로고 이미지 셀
        const tdLogo = document.createElement("td");

        // 텍스트 배지 생성 함수
        const createTextBadge = () => {
          const badge = document.createElement("span");
          badge.className = "logo-text-badge";
          badge.textContent = certName;
          return badge;
        };

        if (!logoFile || logoFile === "-") {
          // 로고 파일명이 '-' 인 경우 바로 텍스트 배지 생성
          tdLogo.appendChild(createTextBadge());
        } else {
          const img = document.createElement("img");
          img.src = "images/" + logoFile;
          img.alt = certInfo;

          // 이미지 파일 로드 에러 처리 (텍스트 배지로 대체)
          img.onerror = () => {
            tdLogo.innerHTML = ""; // 이미지 비우기
            tdLogo.appendChild(createTextBadge());
          };

          tdLogo.appendChild(img);
        }

        row.appendChild(tdCert);
        row.appendChild(tdLogo);
        tableBody.appendChild(row);
      }
    })
    .catch((err) => {
      console.error("Error loading certification info:", err);
      if (detailsBox) {
        detailsBox.innerHTML = `<span style="color: #ef4444;">데이터 로드에 실패했습니다. (data.json 확인 필요)</span>`;
      }
      if (tableBody) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="2" style="color: #ef4444; padding: 20px;">
              인증 정보 데이터를 불러올 수 없습니다.
            </td>
          </tr>
        `;
      }
    });
});
