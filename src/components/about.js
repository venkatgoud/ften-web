import React from "react"

export default (props) => (
  <div className="about">
    <div className="about-close-btn">
      <span onClick={props.onClose}>x</span>
    </div>
    <h3> What is this? </h3>
    <p>This is an application for filmmakers, mostly for Indian filmmakers. It helps in two ways. </p>
    <ul>
      <li>Some Indian screenplays are maintained in two forms. One, a transliteration form
        so that they can be read by people who cannot read the native script. Two, a native version. Writing a screenplay itself is an arduous task in itself and maintaining two versions is a headache one wants to avoid. With this application, one can 'convert' from one form to another easily.
    </li>
      <li>
        The screenplay format -- at least for production -- used in India is also different than the Hollywood format. In the Indian version, the page is split in half vertically. The screen action is on the left and dialogs are on the right. The task of maintaining two versions typically befalls on an unpaid assistant director! This application helps generate an Indian format as needed.
    </li>
    </ul>
    <p> You can just have one script and generate the format you want and whenever you want.</p>
    <p> This is a client-side only app means your screenplay is never sent to any server.</p>
    <h3> Features </h3>
    <ul>
      <li>Load a screenplay from your Dropbox or from your computer.</li>
      <li>Transliterate. Click on the 'Trans' icon on the top. It will open a dual editor where by clicking on the arrow icon, you can transliterate.</li>
      <li>Download the screenplay to your computer or save it to your dropbox</li>
      <li>Generate PDF in Indian movie industry format</li>
      <li>Choose an editor theme you like.</li>
      <li>Navigator to outline your script</li>
    </ul>     
    <p>More details <a href="http://github.com/venkatgoud/ften-web">here</a> </p>
    <h3> Credits </h3>
    <a href="https://github.com/mattdaly/Fountain.js">https://github.com/mattdaly/Fountain.js</a><br />
    <a href="https://github.com/afterwriting">https://github.com/afterwriting</a><br />
    <a href="https://www.npmjs.com/package/sanscript">https://www.npmjs.com/package/sanscript</a> <br />
    Icon made by <a href="https://www.flaticon.com/authors/vignesh-oviyan">Freepik,vignesh</a> from www.flaticon.com
  
  
  
</div>)
