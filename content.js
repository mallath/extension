var url = "";
const todoresp = {todo: "showPageAction"};
chrome.runtime.sendMessage(todoresp);
main();
function main() {
    var data = {};

    
    

    sliderGen(sliderInnerHTMLString);

    chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
      if(msg.todo == "toggle") {
        slider();
      }
    });


    data = extract();   
    var bodycontainer = document.getElementById("slider").querySelector("#sbodycontainer");
    bodycontainer = bodycontainer.querySelector("#objectvalue")
    bodycontainer.value = JSON.stringify(data)
    
    bodycontainer = document.getElementById("slider").querySelector("#sheaderheader");
    var uname = document?.querySelector('div.pv-text-details__left-panel > div > h1') || null;
    uname = uname?.textContent || "";
    bodycontainer.innerHTML = "<h1>"+uname+"</h1>";
    window.onscroll = function() {
        data = extract();
        //alert(JSON.stringify(data));
        var bodycontainer = document.getElementById("slider").querySelector("#sbodycontainer");
        bodycontainer = bodycontainer.querySelector("#objectvalue")
        bodycontainer.value = JSON.stringify(data)

        bodycontainer = document.getElementById("slider").querySelector("#sheaderheader");
        var uname = document?.querySelector('div.pv-text-details__left-panel > div > h1') || null;
        uname = uname?.textContent || "";
        bodycontainer.innerHTML = "<h1>"+uname+"</h1>";
    } 
    
  
  
  document.getElementById('experience_extract_button').addEventListener("click", extractExperience);
  document.getElementById('education_extract_button').addEventListener("click", extractEducation);
}

function sliderGen(sliderInnerHTMLString) {
    var slider = document.createElement("div");
    slider.id = "slider";
    var sliderDivInnerHTML = sliderInnerHTMLString;

    slider.innerHTML += sliderDivInnerHTML;

    document.body.prepend(slider);
}

function slider() {
    var slider = document.getElementById("slider");
    var styler = slider.style;
     if(styler.width == "0px") {
        styler.width = "400px";
    } else {
        styler.width = "0px";
    }
}


function extract() {
   
    var userProfile = {};

    
    const profileSection = document.querySelector(".pv-top-card");
    
    const fullNameElement = profileSection?.querySelector('h1')
    const fullName = fullNameElement?.textContent || null

    const titleElement = profileSection?.querySelector('.text-body-medium')
    var title = titleElement?.textContent || null

    var tbs = profileSection?.querySelectorAll(".text-body-small")
    const locationElement = ((tbs) ? tbs[1] : null)
    var loc = locationElement?.textContent || null

    const photoElement = document.querySelector(".pv-top-card-profile-picture__image") || profileSection?.querySelector('.profile-photo-edit__preview')
    const photo = photoElement?.getAttribute('src') || null

    const descriptionElement = document.querySelector('div#about')?.parentElement.querySelector('.pv-shared-text-with-see-more > div > span.visually-hidden')// Is outside "profileSection"
    var description = descriptionElement?.textContent || null
        

    const url = window.location.url;
    var rawProfileData = {
        fullName,
        title,
        loc,
        photo,
        description,
        url
    }

    var profileData = {
        fullName: getCleanText(rawProfileData.fullName),
        title: getCleanText(rawProfileData.title),
        location: getCleanText(rawProfileData.loc),
        description: getCleanText(rawProfileData.description),
        photo: rawProfileData.photo,
        url: rawProfileData.url
    }

    var nodes = $("#education-section ul > .ember-view");
    let education = [];

    for (const node of nodes) {

        const schoolNameElement = node.querySelector('h3.pv-entity__school-name');
        var schoolName = schoolNameElement?.textContent || null;
        schoolName = getCleanText(schoolName);

        const degreeNameElement = node.querySelector('.pv-entity__degree-name .pv-entity__comma-item');
        var degreeName = degreeNameElement?.textContent || null;
        degreeName = getCleanText(degreeName);

        const fieldOfStudyElement = node.querySelector('.pv-entity__fos .pv-entity__comma-item');
        var fieldOfStudy = fieldOfStudyElement?.textContent || null;
        fieldOfStudy = getCleanText(fieldOfStudy);

        
        const dateRangeElement = node.querySelectorAll('.pv-entity__dates time');

        const startDatePart = dateRangeElement && dateRangeElement[0]?.textContent || null;
        const startDate = startDatePart || null

        const endDatePart = dateRangeElement && dateRangeElement[1]?.textContent || null;
        const endDate = endDatePart || null
        
        
        education.push({
        schoolName,
        degreeName,
        fieldOfStudy,
        startDate,
        endDate
      })
    }

    var languagesection = document.querySelector(".languages");

    var languages = []
  if(languagesection) {
    var lang_nodes = languagesection.querySelectorAll("div > ul > li") || null;
    for(var nodo of lang_nodes) {
      var language = nodo.textContent;
      languages.push(
        getCleanText(language)
      );
    }
  }
  


  var accomplishments = {
    "languages": languages || []
  }

  let volunteer_experience = [];
  var volnodes = document.querySelectorAll('section.volunteering-section li');
  if(volnodes) {

    for(var nodo of volnodes) {
      var vol_title = nodo.querySelector('h3')?.textContent || null;
      var vol_company = nodo.querySelector('h4')?.textContent.replace("Company Name", "") || null;
      var vol_location = nodo.querySelector('.pv-entity__location span:nth-child(2)')?.textContent || null;
      var vol_description = nodo.querySelector('.pv-entity__extra-details')?.textContent || null;
      var date1 = nodo.querySelector('.pv-entity__date-range span:nth-child(2)')?.textContent || null;
      var date2 = nodo.querySelector('.pv-entity__bullet-item')?.textContent || null;

      volunteer_experience.push(
        {
          title: getCleanText(vol_title),
          company: getCleanText(vol_company),
          location: getCleanText(vol_location),
          description: getCleanText(vol_description),
          date1: getCleanText(date1),
          date2: getCleanText(date2)
        }
      );
    }
  }
  userProfile = {
      "profileData": profileData,
      "education": education,
      "volunteer_experience": volunteer_experience,
      "accomplishments" : accomplishments
  }

  
  return userProfile;

  function extractExperience() {
    //defining anchors (roots from where scraping starts)
    var anchor1 = document.getElementById("experience");
    var anchor2 = document.querySelector('.pvs-list');
    
    var list = null;
    var exp = [];
    var roles = [];
    var company = "";
  
    if(anchor1 && !document.getElementById('deepscan').checked) {
      anchor1 = anchor1.nextElementSibling.nextElementSibling
      list = anchor1.querySelector('ul').children;
    } 
  
    if(anchor2 && document.getElementById('deepscan').checked && location.href.includes('experience')) {
      list = anchor2.children;
    } 
  
  
    
    if(list) { //if the anchor exists
      for(i=0; i<list.length; i++) {
        if(document.getElementById('deepscan').checked && !location.href.includes('experience'))
          break;
        company = "";
        roles = [];
  
  
        var elem = list[i].querySelector('div > div').firstElementChild.nextElementSibling; //for anchor 1
        if(elem.querySelector('div > a')) {
          
          company = elem.querySelector('div > a > div > span > span')?.textContent || "";
          company = getCleanText(company);
  
          elem = elem.firstElementChild.nextElementSibling;
          var elems = elem.querySelector('ul').children
  
          for(j=0; j < elems.length; j++) {
            
            
            var keke = elems[j].querySelector("div > div")?.nextElementSibling || null;
            keke = keke.querySelector('div > a')
  
            kchilds = keke.children;
            var rname=" ", startDate=" ", endDate=" ", loc=" ";
            for(k=0; k<kchilds.length; k++) {
  
              
              if(k==0) 
                rname = kchilds[k]?.querySelector('span > span').textContent || "";
              if(k==1) 
                {
                  var ta = kchilds[k].querySelector('span').textContent.split(/[-·]/);
                  startDate = ta[0];
                  endDate = ta[1];
                }
              if(k==2) 
                loc= kchilds[k].querySelector('span')?.textContent || ""; 
                
             } 
  
              roles.push({
                'id': j,
                'title': getCleanText(rname),
                'startDate': getCleanText(startDate),
                'endDate': getCleanText(endDate),
                'location': getCleanText(loc)  
              });
  
          } 
  
  
          } else {
            elem = elem.querySelector('div > div > div > div');
  
            echilds = elem.children;
            var rname=" ", startDate=" ", endDate=" ", loc=" ";
            for(k=0; k<echilds.length; k++) {
  
              
              if(k==0) 
                rname = echilds[k]?.querySelector('span > span').textContent || "";
              if(k==2)
                {
                  var ta = echilds[k].querySelector('span').textContent.split(/[-·]/);
                  startDate = ta[0];
                  endDate = ta[1];
                }
              if(k==3) //role location 
                loc = echilds[k].querySelector('span')?.textContent || ""; 
              
              if(k==1) 
                company = echilds[k].querySelector('span')?.textContent || "";
                if(company)
                  company = company.split(/[-·]/)[0];
             } 
             
  
             roles.push({
              'id': 0,
              'title': getCleanText(rname),
              'startDate': getCleanText(startDate),
              'endDate': getCleanText(endDate),
              'location': getCleanText(loc)  
            });
        }
        a:
       exp.push({
        'id': i,
        'company': company,
        'roles': roles
       });

      }
  } 
 document.getElementById('experiencetext').value = JSON.stringify(exp);
} 

function extractEducation(){
    
    var anchor1 = document.getElementById("education");
    var anchor2 = document.querySelector('.pvs-list');
   
    var list = null;
 
    if(anchor1 && !document.getElementById('deepscan').checked) {
       anchor1 = anchor1.nextElementSibling.nextElementSibling
       list = anchor1.querySelector('ul').children;
     } 
 
   if(anchor2 && document.getElementById('deepscan').checked && location.href.includes('experience')) {
       list = anchor2.children;
     } 
 
   if(list) { 
     for(i=0; i<list.length; i++) {
       if(document.getElementById('deepscan').checked && !location.href.includes('experience'))
         break;
       
     }
   } 
   
 } 

 function expandButtons() {
    const expandButtonsSelectors = [
        '.pv-profile-section.pv-about-section .lt-line-clamp__more', // About
        '#experience-section .pv-profile-section__see-more-inline.link', // Experience
        '.pv-profile-section.education-section button.pv-profile-section__see-more-inline', // Education
        '.pv-skill-categories-section [data-control-name="skill_details"]', // Skills
      ];
  
      const seeMoreButtonsSelectors = ['.pv-entity__description .lt-line-clamp__line.lt-line-clamp__line--last .lt-line-clamp__more[href="#"]', '.lt-line-clamp__more[href="#"]:not(.lt-line-clamp__ellipsis--dummy)']
  
      for (const buttonSelector of expandButtonsSelectors) {
        try {
          if ($(buttonSelector) !== null) {
            $(buttonSelector).click();
          }
        } catch (err) {
          alert("Couldn't expand buttons");
        }
      }
  
  
      for (const seeMoreButtonSelector of seeMoreButtonsSelectors) {
        const buttons =  $(seeMoreButtonSelector)
  
        for (const button of buttons) {
          if (button) {
            try {
                button.click()
            } catch (err) {
              alert("Error expanding see more buttons");
            }
          }
        }
      }
  }
  
  
  
  function getCleanText(text) {
      const regexRemoveMultipleSpaces = / +/g
      const regexRemoveLineBreaks = /(\r\n\t|\n|\r\t)/gm
    
      if (!text) return null
    
      const cleanText = text.toString()
        .replace(regexRemoveLineBreaks, '')
        .replace(regexRemoveMultipleSpaces, ' ')
        .replace('...', '')
        .replace('See more', '')
        .replace('See less', '')
        .trim()
    
      return cleanText
  }
}
 
 
 
