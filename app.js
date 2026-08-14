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
      const model = (item.model || "").toString().trim();
      const modelLine =
        model && model !== "-"
          ? `<br><strong>Model No:</strong> ${model}`
          : "";
      detailsBox.innerHTML = `
        <div class="product-name-row">
          <strong>Name:</strong>
          <span class="product-name"></span>
        </div>${modelLine}
      `;
      detailsBox.querySelector(".product-name").textContent = item.name || "-";

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
        const logoNames = certName.split(" / ").map((n) => n.trim());
        const logoFiles = logoFile
          .split(" / ")
          .map((f) => f.trim())
          .filter((f) => f.length > 0);

        const createTextBadge = (label) => {
          const badge = document.createElement("span");
          badge.className = "logo-text-badge";
          badge.textContent = label || certName;
          return badge;
        };

        const appendLogo = (container, file, label) => {
          if (!file || file === "-") {
            container.appendChild(createTextBadge(label));
            return;
          }

          const img = document.createElement("img");
          img.src = "images/" + file;
          img.alt = label || certInfo;
          img.onerror = () => {
            img.replaceWith(createTextBadge(label));
          };
          container.appendChild(img);
        };

        if (logoFiles.length <= 1) {
          appendLogo(tdLogo, logoFiles[0] || "-", logoNames[0] || certName);
        } else {
          const group = document.createElement("div");
          group.className = "logo-group";
          logoFiles.forEach((file, idx) => {
            if (idx > 0) {
              const sep = document.createElement("span");
              sep.className = "logo-sep";
              sep.textContent = "/";
              group.appendChild(sep);
            }
            appendLogo(group, file, logoNames[idx] || certName);
          });
          tdLogo.appendChild(group);
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
