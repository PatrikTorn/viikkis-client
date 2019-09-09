export const API_ENDPOINT = "http://viikkis.indecs.fi/api.php";
export const AUTH_ENDPOINT = "http://viikkis.indecs.fi/login.php";
export const SOCKET_ENDPOINT = "http://viikkis.herokuapp.com";
// export const SOCKET_ENDPOINT = "http://localhost:5000";

export const TITLES = [
  {
    fi: "Yleistä",
    en: "General"
  },
  {
    fi: "Indecsin tapahtumat",
    en: "Indecs events"
  },
  {
    fi: "TREY tiedottaa",
    en: "Student Union announces"
  },
  {
    fi: "Tampereen Teekkarit tiedottaa",
    en: "Teekkari Union of Tampere announces"
  },
  {
    fi: "Yritystiimi tiedottaa",
    en: "Corporate Relations Team announces"
  },
  {
    fi: "Tulevat tapahtumat",
    en: "Upcoming events"
  },
  {
    fi: "ESTIEM asiaa",
    en: "ESTIEM affairs"
  },
  {
    fi: "Loppukevennys",
    en: ""
  }
];

export const SCREENS = {
  SUMMARY: "SUMMARY",
  ARTICLE: "ARTICLE",
  CONFIG_SETTINGS: "CONFIG_SETTINGS"
};

export const MD_CONFIG = (config, week, number) =>
  `otsikon_ylle: ${config.guild}
otsikon_alle: Numero ${number} – Viikko ${week}
sposti_aihe: Indecsin Viikkotiedote ${number} — Indecs' Newsletter ${number}
url: ${config.url}
nimi: ${config.name}
titteli: ${config.job} / ${config.job_en}
kilta: ${config.guild}
guild: ${config.guild_en}
yliopisto: ${config.university}
university: ${config.university_en}
puhelin: ${config.phone}
sposti: ${config.email}
internet: ${config.url}
`;

export const MD_CONFIG_TOC = `

# Sisällysluettelo – Table of Contents

[TOC]

`;

export const SUMMARY_TOP = (week, tableOfContents, config, number) => `
<font class="margin"></font>
<font class="top-kilta">${config.guild}</font>
<font class="top-viikkotiedote">Viikkotiedote</font>
<font class="top-numero">Numero ${number} – Viikko ${week}</font>
<font class="margin"></font>
<font class="top-toc"> Sisällysluettelo – Table of contents</font>
${tableOfContents}
`;

export const SUMMARY_BOTTOM = config => `
<font class="margin"></font>
<font class="top-kilta">Terveisin – Regards</font>
<font class="top-viikkotiedote">${config.name}</font>
<font class="top-numero">${config.job} / ${config.job_en}</font>
<font class="bottom-default">${config.guild}</font>
<font class="bottom-default">${config.guild_en}</font>
<font class="bottom-default">${config.university}</font>
<font class="bottom-default">${config.university_en}</font>
<font class="bottom-default">${config.phone}</font>
<font class="bottom-default">${config.email}</font>
<font class="bottom-default">[${config.url}](${config.url})</font>
<font class="margin"></font>
`;
