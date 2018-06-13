var Minecraft = {};

Minecraft.emptyBoard = {
    ground: 0,
    shrubbery: 0,
    bark: 0,
    stone: 0,
    grass: 0
}

Minecraft.start = function () {
    Minecraft.theGrid = [];
    $(".game-container").html("");
    Minecraft.toggleSelected();
    $(".resource-box").attr("class", "resource-box");
    $("#new_game").addClass("animated hinge");
    setTimeout(function () {
        $("#new_game").css("display", "none");
    }, 2000)
    $(".button").css("visibility", "visible");
    $(".game-container").css("visibility", "visible");
    $(".side-bar").css("visibility", "visible");
    Minecraft.generateGrid();
    Minecraft.resource = null;
    $(".tool-box").click(Minecraft.selectTool);
    Minecraft.elements = jQuery.extend({}, Minecraft.emptyBoard);
    Minecraft.printResources();
}

Minecraft.generateGrid = function () {
    var height = 20;
    var width = 20;
    for (var x = 0; x < width; x++) {
        var floor = document.createElement("div");
        Minecraft.theGrid.push([]);
        $(".game-container")[0].prepend(floor);
        const initGround = 4;
        const initGrass = 5;
        const startBarkRow = 5;
        const endBarkRow = 11;
        const barkCol = 16;
        const startStoneRow = 6;
        const endStoneRow = 8;
        const startStoneCol = 3;
        const endStoneCol = 6;
        const startShrubberyRow = 11;
        const endShrubberyRow = 16;
        const startShrubberyCol = 14;
        const endShrubberyCol = 18;
        for (var y = 0; y < height; y++) {
            var block = $(document.createElement("div"))
                .addClass("block")
                .data("column", y)
                .data("row", x)
                .click(Minecraft.buildElement)
                .click(Minecraft.collectElement);

            Minecraft.theGrid[x].push(block);
            if (x <= initGround) {
                block.addClass("ground");
            }
            if (x == initGrass) {
                block.addClass("grass");
            }
            if (x > startBarkRow && x < endBarkRow && y == barkCol) {
                block.addClass("bark");
            }
            if ((x >= startStoneRow && x < endStoneRow && (y >= startStoneCol && y < endStoneCol)) 
            || (x == startStoneRow && y == endStoneCol || (x == endStoneRow && (y > startStoneCol && y < endStoneCol)))) {
                block.addClass("stone");
            }
            if ((x >= startShrubberyRow && x <= endShrubberyRow && (y > startShrubberyCol && y < endShrubberyCol)) 
            || (x > startShrubberyRow && x < endShrubberyRow && (y >= startShrubberyCol && y <= endShrubberyCol))) {
                block.addClass("shrubbery");
            }
            $(floor).append(block);
        }
    }
    $(".resource-box").click(Minecraft.selectResource);
}

Minecraft.selectTool = function () {
    Minecraft.toggleSelected();
    Minecraft.tool = $(this)[0].classList[1];
    $($(this)[0]).addClass("selected");
    $(".game-container").css("cursor", `url("./images/${Minecraft.tool}2.png") 4 20, auto`);
}

Minecraft.toggleSelected = function () {
    Minecraft.tool = null;
    Minecraft.resource = null;
    $(".game-container").css("cursor", "initial");
    $(".selected").removeClass("selected");
}

Minecraft.collectElement = function () {
    $clickedElement = $($(this)[0]);
    if ($clickedElement.hasClass("ground") && Minecraft.tool == "shovel") {
        $clickedElement.removeClass("ground");
        $(".resource-box:nth-child(1)").addClass("ground");
        Minecraft.elements.ground++;
    } else if ($clickedElement.hasClass("shrubbery") && Minecraft.tool == "axe") {
        $clickedElement.removeClass("shrubbery");
        $(".resource-box:nth-child(2)").addClass("shrubbery");
        Minecraft.elements.shrubbery++;
    } else if ($clickedElement.hasClass("bark") && Minecraft.tool == "axe") {
        $clickedElement.removeClass("bark");
        $(".resource-box:nth-child(3)").addClass("bark");
        Minecraft.elements.bark++;
    } else if ($clickedElement.hasClass("stone") && Minecraft.tool == "pickaxe") {
        $clickedElement.removeClass("stone");
        $(".resource-box:nth-child(4)").addClass("stone");
        Minecraft.elements.stone++;
    } else if ($clickedElement.hasClass("grass") && Minecraft.tool == "shovel") {
        $clickedElement.removeClass("grass");
        $(".resource-box:nth-child(5)").addClass("grass");
        Minecraft.elements.grass++;
    }
    Minecraft.printResources();
}

Minecraft.selectResource = function (property) {
    if ($(".resource-box.element.selected").length == 0) {
        Minecraft.toggleSelected();
        $($(this)[0]).addClass("selected");
    } else {
        Minecraft.toggleSelected();
        $($(this)[0]).addClass("selected");
    }
    Minecraft.resource = $($(this)[0]);
    if ($('#theme').attr('href') == './css/minecraft.css'){
        $(".game-container").css("cursor", `url("./images/cursor/${this.classList[1]}-cur.jpg") 4 20, auto`);
    } else {
        $(".game-container").css("cursor", `url("./images/cursor/${this.classList[1]}-cur.png") 4 20, auto`);
    }
    return Minecraft.resource;
}

Minecraft.checkIfValidBuild = function (elementType) {
    var amountOfElement = $(Minecraft.elements).attr(elementType);
    if (amountOfElement > 0) {
        $(Minecraft.elements).attr(elementType, amountOfElement);
        var currentRow = $(event.target).data("row");
        var currentCol = $(event.target).data("column");
        if ((Minecraft.theGrid[currentRow][currentCol])[0].classList.length == 1) {
            if (Minecraft.checkBottom(currentRow, currentCol) ||
                Minecraft.checkLeft(currentRow, currentCol) ||
                Minecraft.checkRight(currentRow, currentCol) ||
                Minecraft.checkTop(currentRow, currentCol)) {
                amountOfElement--;
                $(Minecraft.elements).attr(elementType, amountOfElement);
                return true;
            }
        }
    }
    return false;
}

Minecraft.checkLeft = function (currentRow, currentCol) {
    if (currentCol == 0) {
        return false;
    }
    if ((Minecraft.theGrid[currentRow][currentCol - 1])[0].classList.length == 2) {
        return true;
    }
    return false;
}

Minecraft.checkRight = function (currentRow, currentCol) {
    if (currentCol == 19) {
        return false;
    }
    if ((Minecraft.theGrid[currentRow][currentCol + 1])[0].classList.length == 2) {
        return true;
    }
    return false;
}

Minecraft.checkBottom = function (currentRow, currentCol) {
    if (currentRow == 0) {
        return false;
    }
    if ((Minecraft.theGrid[currentRow - 1][currentCol])[0].classList.length == 2) {
        return true;
    }
    return false;
}

Minecraft.checkTop = function (currentRow, currentCol) {
    if (currentRow == 19) {
        return false;
    }
    if ((Minecraft.theGrid[currentRow + 1][currentCol])[0].classList.length == 2) {
        return true;
    }
    return false;
}

Minecraft.printResources = function () {
    var j = 0;
    for (var i in Minecraft.elements) {
        $($(".resource-box")[j]).text(Minecraft.elements[i])
            .addClass(i);
        j++;
    }
}

Minecraft.buildElement = function (property) {
    if (Minecraft.resource !== null && Minecraft.resource !== undefined) {
        var $setResource = $(event.target);
        if ($(Minecraft.resource).hasClass("ground") && Minecraft.checkIfValidBuild("ground")) {
            $setResource.addClass("ground");
        } else if ($(Minecraft.resource).hasClass("shrubbery") && Minecraft.checkIfValidBuild("shrubbery")) {
            $setResource.addClass("shrubbery");
        } else if ($(Minecraft.resource).hasClass("bark") && Minecraft.checkIfValidBuild("bark")) {
            $setResource.addClass("bark");
        } else if ($(Minecraft.resource).hasClass("stone") && Minecraft.checkIfValidBuild("stone")) {
            $setResource.addClass("stone");
        } else if ($(Minecraft.resource).hasClass("grass") && Minecraft.checkIfValidBuild("grass")) {
            $setResource.addClass("grass");
        }
        Minecraft.printResources();
    }
}

Minecraft.switchTheme = function (){
    if ($('#theme').attr('href') == './css/minecraft.css'){
        $('#theme').attr('href', './css/minecraft_winter.css');
    } else {
        $('#theme').attr('href', './css/minecraft.css');
    }
}
