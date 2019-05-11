export const API_ENDPOINT = 'http://viikkis.indecs.fi/api.php';
export const AUTH_ENDPOINT = 'http://viikkis.indecs.fi/login.php';
// export const SOCKET_ENDPOINT = 'http://viikkis.herokuapp.com';
export const SOCKET_ENDPOINT = 'http://localhost:5000';

export const TITLES = [
    {
        fi: 'Yleistä',
        en: 'General'
    },
    {
        fi: 'Indecsin tapahtumat',
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
    SUMMARY:'SUMMARY',
    ARTICLE:'ARTICLE',
}

export const MD_CONFIG = `
otsikon_ylle: Tuotantotalouden kilta Indecs
otsikon_alle: Viikko 1
sposti_aihe: Indecsin Viikkotiedote 1 — Indecs' Newsletter 1
url: http://www.google.fi
nimi: Leevi Törnblom
titteli: Sihteeri / Secretary
kilta: Tuotantotalouden kilta Indecs Ry
guild: Guild of Industrial Engineering and Management Indecs
yliopisto: Tampereen teknillinen yliopisto
university: Tampere University of Technology
puhelin: 0408431989
sposti: sihteeri@indecs.fi
internet: www.indecs.fi
`;

export const MD_CONFIG_TOC = `

# Sisällysluettelo - Table of Contents

[TOC]

`;

export const SUMMARY_TOP = (week, tableOfContents) => `
<font class="margin"></font>
<font class="top-kilta">Tuotantotalouden kilta Indecs</font>
<font class="top-viikkotiedote">Viikkotiedote</font>
<font class="top-numero">Numero ${week - 1} - Viikko ${week}</font>
<font class="margin"></font>
<font class="top-toc"> Sisällysluettelo - Table of contents</font>
${tableOfContents}
`;

export const SUMMARY_BOTTOM = `
<font class="margin"></font>
<font class="top-kilta">Terveisin - Regards</font>
<font class="top-viikkotiedote">Leevi Törnblom</font>
<font class="top-numero">Sihteeri / Secretary</font>
<font class="bottom-default">Tuotantotalouden kilta Indecs ry</font>
<font class="bottom-default">Guild of Industrial Engineering and Management Indecs</font>
<font class="bottom-default">Tampereen yliopisto</font>
<font class="bottom-default">Tampere University</font>
<font class="bottom-default">0408431989</font>
<font class="bottom-default">sihteeri@indecs.fi</font>
<font class="bottom-default">[www.indecs.fi]www.indecs.fi</font>
<font class="margin"></font>
`;