export default function Select({ aoAlterar, label, opcoes, valorSelecionado, className }: SelectProps) {


    return (
        <div className={`flex flex-col gap-2 ${className ? className : ''}`}>
            <label htmlFor={label} className="font-medium text-foreground">
                {label}
            </label>
            <select
                id={label}
                value={valorSelecionado}
                onChange={(e) => aoAlterar(e.target.value)}
                className="border border-border bg-background text-foreground rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
                <option disabled value="">Selecione...</option>
                {opcoes.map((opcao) => criarOption(opcao))}
            </select>
        </div>
    )
}


function criarOption({ valor, texto, key }: OptionProps) {
    return <option key={key ?? valor} value={valor}>{texto}</option>;
}



export type SelectProps = {
    label: string;
    valorSelecionado: string | undefined;
    aoAlterar: (novoValor: string) => void;
    opcoes: OptionProps[];
    className?: string;
}

export type OptionProps = {
    valor: string | number;
    texto: string;
    key?: string;
}

