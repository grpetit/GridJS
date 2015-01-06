

function rayoncarre(x,y) {
    return x*x+y*y;
};

function insideCircle(rcarre){
    if(rcarre<=1)
        return true
    else
        return false
};

function main(m){
    $("#rayon").text(rayoncarre(m.x,m.y));
    $("#result").text(insideCircle(rayoncarre(m.x,m.y)));
    $.ajax({
        type: "POST",
        url: "/result",
        data: {insideCircle: insideCircle(rayoncarre(m.x,m.y))},
        success : function(code_html, statut){ console.log("success"); if(code_html != "end") location.reload();},
        error : function(resultat, statut, erreur){console.log("failed "+msg);}
    })
    
}