import md2html from "../editor/helpers/md2html";
import md2mjml from "../editor/helpers/md2mjml";

export const formatTitle = (fi, en) => {
  return en ? `${fi} – ${en}` : `${fi}`;
};

export const lastEdited = editedAt => {
  let templates = {
    prefix: "",
    suffix: " sitten",
    seconds: "alle minuutti",
    minute: "noin minuutti",
    minutes: "%d minuuttia",
    hour: "noin tunti",
    hours: "noin %d tuntia",
    day: "päivä",
    days: "%d päivää",
    month: "noin kuukausi",
    months: "%d kuukautta",
    year: "noin vuosi",
    years: "%d vuotta"
  };

  let time = editedAt;

  let template = function(t, n) {
    return templates[t] && templates[t].replace(/%d/i, Math.abs(Math.round(n)));
  };

  if (time === "0000-00-00 00:00:00") return "Ei muokattu";
  time = time.replace(/\.\d+/, ""); // remove milliseconds
  time = time.replace(/-/, "/").replace(/-/, "/");
  time = time.replace(/T/, " ").replace(/Z/, " UTC");
  time = time.replace(/([\+\-]\d\d)\:?(\d\d)/, " $1$2"); // -04:00 -> -0400
  time = new Date(time * 1000 || time);

  let now = new Date();
  let seconds = ((now.getTime() - time) * 0.001) >> 0;
  let minutes = seconds / 60;
  let hours = minutes / 60;
  let days = hours / 24;
  let years = days / 365;

  return (
    "muokattu " +
    templates.prefix +
    ((seconds < 45 && template("seconds", seconds)) ||
      (seconds < 90 && template("minute", 1)) ||
      (minutes < 45 && template("minutes", minutes)) ||
      (minutes < 90 && template("hour", 1)) ||
      (hours < 24 && template("hours", hours)) ||
      (hours < 42 && template("day", 1)) ||
      (days < 30 && template("days", days)) ||
      (days < 45 && template("month", 1)) ||
      (days < 365 && template("months", days / 30)) ||
      (years < 1.5 && template("year", 1)) ||
      template("years", years)) +
    templates.suffix
  );
};

export const mdToHtml = md => {
  if (typeof md === "object") {
    md = md.join("\n\n");
  }
    return md2html(headingCaps(md));
};
export const mdToMjml = md => {
  if (typeof md === "object") {
    md = md.join("\n\n");
  }
  return md2mjml(headingCaps(md));
};

export const headingCaps = (md) => {
  return md.split("\n").reduce((acc, str) => {
    ["#", "##", "###"].map(i => {
      if (str.substr(0, i.length) === i && str.charAt(i.length) !== "#")
        str = [str.slice(0, i.length), " ", str.slice(i.length)].join("");
    });

    return acc + str + "\n";
  }, "")
}

export const createMarkdownTOC = value => {
  let _1 = 0;
  let _2 = 0;
  let _3 = 0;
  return value
    .replace("\n\n", "\n")
    .split("\n")
    .map(i => i.trim())
    .filter(i => i.length > 0)
    .reduce((acc, str) => {
      if (str.substring(0, 3) === "###") {
        _3 = _3 + 1;
        return (
          acc +
          `    - [${_1}.${_2}.${_3}. ${str.replace(
            "###",
            ""
          )}](#toc_${_1}_${_2}_${_3})\n`
        );
      } else if (str.substring(0, 2) === "##") {
        _3 = 0;
        _2 = _2 + 1;
        return (
          acc +
          `  - [${_1}.${_2}. ${str.replace("##", "")}](#toc_${_1}_${_2})\n`
        );
      } else if (str.substring(0, 1) === "#") {
        _3 = 0;
        _2 = 0;
        _1 = _1 + 1;
        return (
          acc + `- [${_1}. ${str.replace("#", "")}](#toc_${_1})\n`
        );
      } else return acc;
    }, []);
};

export const createMjml = (content, config, week) => {
  if (typeof content == "array") {
    content = content.join("\n\n");
  }
  return `
<mjml>
    <mj-head>
        <mj-title>Indecsin Viikkotiedote ${config.number} — Indecs' Newsletter ${config.number}</mj-title>
        <mj-style inline="inline">
        p       {{ font-size: 16px; margin: 10px 0px}}
        h1      {{ font-size: 25px; font-weight:900; }}
        h2      {{ font-size: 23px; font-weight:400}}
        h3      {{ font-size: 21px; font-weight:400}}
        tr th   {{ border-bottom:1px solid #ecedee;text-align:left }}
        ul,ol   {{ margin: 10px 0px }}
        ul ul, ol ol, ol ul, ul ol   {{ margin: 0px 0px }}

        </mj-style>
        <mj-font name="Source Sans Pro" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,200i,300,300i,400,400i,600,600i,700,700i,900,900i"></mj-font>
        <mj-attributes>
            <mj-body background-color="#eeeeee"></mj-body>
            <mj-all font-family="Source Sans Pro, Helvetica, Arial, sans-serif"></mj-all>
            <mj-text font-size="16px" font-weight="400" color="#2e3131" padding="0px 25px" line-height="24px"></mj-text>

            <mj-class name="paragraph" padding="0px 25px"/>
            <mj-class name="heading1"  padding-top="10px" padding-bottom="0px" padding-left="25px" padding-right="25px" color="#2e3131" text-transform="uppercase" />
            <mj-class name="heading2" line-height="22px" padding-top="27px" padding-bottom="0px" padding-left="25px" padding-right="25px" color="#C01F29" />
            <mj-class name="heading3"  padding-top="0px" padding-bottom="0px" padding-left="25px" padding-right="25px" color="#C01F29" />

            <mj-button align="left" background-color="#C01F29" color="white" padding-bottom="25px" font-weight="900" inner-padding="10px 18px" text-transform="uppercase" />
            <mj-table></mj-table>
            <mj-divider padding-bottom="50px" padding-top="50px" border-width="2px" border-style="dashed" border-color="silver" /> 
            <mj-section background-color="white"></mj-section>
            <mj-column></mj-column>
            <mj-text></mj-text>

            <mj-accordion border="none" padding="1px" />
            <mj-accordion-element icon-wrapped-url="http://i.imgur.com/Xvw0vjq.png" icon-unwrapped-url="http://i.imgur.com/KKHenWa.png" icon-height="24px" icon-width="24px" />
            <mj-accordion-title font-family="Roboto, Open Sans, Helvetica, Arial, sans-serif" background-color="#fff" color="#031017" padding="15px" font-size="18px" />
            <mj-accordion-text font-family="Open Sans, Helvetica, Arial, sans-serif" background-color="#fafafa" padding="15px" color="#505050" font-size="14px" />

      </mj-attributes>
    </mj-head>
    <mj-body>
        <mj-section>
            <mj-column>
                <mj-image width="200px" padding-top="100px" src="https://indecs.fi/indecs-fi/wp-content/uploads/2019/01/Indecs_logo_teksti.png" /> 
                <mj-text font-size="22px" font-weight="300" padding-top="50px" padding-bottom="2px" color="black" align="center">${
                  config.guild
                }</mj-text>
                <mj-text font-size="40px" font-weight="900" font-style="italic" text-transform="uppercase" line-height="40px" padding-top="0px" padding-bottom="2px" color="#C01F29" align="center">Viikkotiedote</mj-text>
                <mj-text font-size="22px" font-weight="700" padding-top="0px" text-transform="uppercase" padding-bottom="80px" color="#2e3131" align="center">Numero ${config.number} — Viikko ${week}</mj-text>
            </mj-column>
        </mj-section>

        <mj-section>
            <mj-column>
                ${mdToMjml(content)}
            </mj-column>
        </mj-section>

        <mj-section>
            <mj-column padding-bottom="120px">
                <mj-divider padding-top="70px" padding-bottom="120px" border-width="2px" border-style="dashed" border-color="silver" /> 
                <mj-text font-size="20px" font-weight="300" padding-top="35px" padding-bottom="10px" color="black" align="center">Terveisin - Regards,</mj-text>
                <mj-text font-size="35px" font-weight="800" text-transform="uppercase" font-style="italic" line-height="35px" padding-top="0px" padding-bottom="10px" color="#C01F29" align="center">${
                  config.name
                }</mj-text>
                <mj-text font-size="20px" font-weight="800" text-transform="uppercase" padding-top="0px" padding-bottom="10px" color="#2e3131" align="center">${
                  config.job
                } / ${config.job_en}</mj-text>
                <mj-text font-size="16px" font-weight="300" color="#2e3131" align="center">
                    ${config.guild}<br>
                    ${config.guild_en}<br>
                    ${config.university}<br>
                    ${config.university_en}<br>
                    ${config.phone}<br>
                    <a href="mailto:${config.email}">${config.email}</a><br>
                    <a href="${config.url}">${config.url}</a>
                </mj-text>
            </mj-column>
        </mj-section>
    </mj-body>
</mjml>
`;
};
