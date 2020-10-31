function applyNumbers(current, isCreate=true) {
    current = _.flatten(current)
    if (isCreate) {
        const indexesOfZeroRect = _.compact(current.map((value, index) => value === 0 ? index : 0))
        const randomCreateRect = _.random(indexesOfZeroRect.length - 1)
        current[ indexesOfZeroRect[randomCreateRect] ] = 2
    }
    _.zip($(".block"), current).map(([ item, numb ]) => {
        item.innerHTML = numb === 0 ? "" : numb
    })
    return _.chunk(current, 4)
}
function reset() {
    var initialNumbers = ([
        [0, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 2, 0],
        [0, 0, 0, 0],
    ])
    applyNumbers(initialNumbers, false)
}

function getCurrentNumbers() {
    const current = _.chunk( $(".block").map((_, v) => v.innerHTML ? Number(v.innerHTML) : 0), 4 )
    return current
}

function increaseIfRelate(current) {
    const result = []
    for (i = 0; i < current.length; i++) {
        const row = _.compact(current[i])
        let tempRow = []
        if (row.length <= 1) {
            tempRow = row
        } else {
            for (j = 0; j < row.length; j++) {
                if (j+1 < row.length && row[j] === row[j+1]) {
                    tempRow.push(row[j] + row[j+1])
                    j++
                } else {
                    tempRow.push(row[j])
                }
            }
        }
        result.push(_.concat(tempRow, Array(current[i].length - tempRow.length).fill(0)))
    }
    return result
}

function reverseByRow(current) {
    return current.map((_, v) => _.reverse(v))
}

function zipByColumn(current) {
    return _.zip(...current)
}

function isLose(current) {
    if (_.findIndex(_.flatten(current), i => i === 0) !== -1) {
        return false
    }
    for (i = 0; i < current.length; i++) {
        for (j = 0; j+1 < current[i].length; j++) {
            if (current[i][j] === current[i][j+1]) {
                return false
            }
        }
    }
    current = zipByColumn(current)
    for (i = 0; i < current.length; i++) {
        for (j = 0; j+1 < current[i].length; j++) {
            if (current[i][j] === current[i][j+1]) {
                return false
            }
        }
    }
    return true
}

function playKeydown(e) {
    let before = current = getCurrentNumbers()
    switch ( e.which ) {
        // left
        case 37:
            current = increaseIfRelate(current)
            break;
        // up
        case 38:
            current = zipByColumn(current)
            current = increaseIfRelate(current)
            current = zipByColumn(current)
            break;
        // right
        case 39:
            current = reverseByRow(current)
            current = increaseIfRelate(current)
            current = reverseByRow(current)
            break;
        // down
        case 40:
            current = zipByColumn(current)
            current = reverseByRow(current)
            current = increaseIfRelate(current)
            current = reverseByRow(current)
            current = zipByColumn(current)
            break;
        default:
            return
    }
    if (!_.isEqual(before, current)) {
        current = applyNumbers(current)
    }
    if ( isLose(current) ) {
        setTimeout(() => alert("You lose!"), 100)
    }
}


$(function() {
    // key mounting
    $(document).keydown(playKeydown)
    reset()
});