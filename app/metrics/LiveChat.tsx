'use client'

import Script from "next/script"

const LiveChat = () => {
    return (
        <Script
            id="live-chat-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
                __html: `
                ((function(d, src, c) { var t=d.scripts[d.scripts.length - 1],s=d.createElement('script');s.id='la_x2s6df8d';s.defer=true;s.src=src;s.onload=s.onreadystatechange=function(){var rs=this.readyState;if(rs&&(rs!='complete')&&(rs!='loaded')){return;}c(this);};t.parentElement.insertBefore(s,t.nextSibling);})(document,
                    'https://veestore.ladesk.com/scripts/track.js',
                    function(e){ LiveAgent.createButton('2uu9zqsg', e); });
                `,
            }}
        />
    )
}

export default LiveChat