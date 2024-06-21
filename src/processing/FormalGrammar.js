import Grammar from "../models/Grammar";

export default class FormalGrammar {

    constructor() {
        this.base = new Grammar();
    }

    reducer = (state, action) => {

        const params = action.payload;
    
        switch (action.type) {
    
            case 'updateSet':

                return this.updateSet(state, params.set, params.i, params.event);
            
            case 'updateProductions':

                return this.updateProductions(state, params.i, params.j, params.event);

            case 'updateS':

                return this.updateS(state, params.event);

            case 'addSetElement': 

                return this.addSetElement(state, params.set);
            
            case 'addRule': 

                return this.addRule(state, params.i);   

            case 'addRuleSet': 

                return this.addRuleSet(state);    
            
            case 'checkRules':
                
                return this.checkRules(state, params.i, params.j, params.event);    

            case 'checkSetInput':
                return this.checkSetInput(state, params.set);
            default:
                return state;
        }
    }

    updateSet = (state, set, i, event) => {
        const newState = { ...state };
        newState[set][i] = event.target.value;
        return newState;
    }
    
    updateProductions = (state, i, j, event) => {

        const newState = { ...state };
        let input = event.target.value.trim();
        
        if (j === 0) {
            let existsRuleSet = false;
            for(let k in state.P){
                if(input === state.P[k][0] && k != i)
                    existsRuleSet=true;
            }
            if(existsRuleSet){
                newState.P[i][j] ="";
                return newState;
            }
            if(!state.V.includes(input)){
                newState.P[i][j] ="";
                return newState;
            }
            newState.P[i][j] = input;
        } else {
            if (input == "eps") {
                newState.P[i][j] = ['eps'];
            } else {
                let splitInput = input.split(" ");
                console.log(input+"-"+splitInput);
                if (splitInput.length !== 2) {
                    return newState;
                }
                newState.P[i][j] = [splitInput[0], splitInput[1]];
            }
        }
        return newState;
    }

    updateS = (state, event) => {
        const newState = { ...state };
        newState.S = event.target.value;
        return newState;
    }

    addSetElement = (state, set) => {
        const newState = { ...state };
        newState[set] = [...newState[set], ""];
        return newState;
    }

    addRule = (state, i) => {
        const newState = { ...state };
        newState.P[i] = [...newState.P[i], [""]];
        return newState;
    }

    addRuleSet = (state) => {
        const newState = { ...state };
        newState.P = [...newState.P, ["", [""]]];
        return newState;
    }

    checkRules = (state, i, j, event) => {

        let input = event.target.value.trim();
        
        if (input == "eps") {
            event.target.value = "eps";
            return state;
        }
        
        let splitInput = input.split(" ");

        if (splitInput.length !== 2) {
            if (j === 0) {
                let existsRuleSet = false;
                for(let k in state.P){
                    if(input === state.P[k][0] && k != i)
                        existsRuleSet=true;
                }
                if(existsRuleSet){
                    console.error("Já existe um rule set com essa cabeça");
                    event.target.value = state.P[i][j];
                }
                if(!state.V.includes(splitInput[0])){
                    console.error("cabeça deve estar em V");
                    event.target.value = state.P[i][j];
                }
            } else {
                event.target.value = state.P[i][j].join(" ");
                console.error("Input must contain exactly two elements separated by a space.");
            }
        }

        return state;
    }

    checkSetInput = (state, set) => {
        const newState = { ...state };
        console.log("aqui", newState[set].slice(-1)[0])
        if(newState[set].slice(-1)[0] == "") {
            newState[set] = [...newState[set].slice(0, -1)];
            return newState;
        }
        return state;
    }

}