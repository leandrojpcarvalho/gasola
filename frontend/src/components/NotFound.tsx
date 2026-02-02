export function NotFound() {
    // refatorar utilizando componentes de estilo já existentes e tailwindcss com tematica de jogo da forca se possivel colocar uma pessoa enforcada ou algo do tipo
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-9xl font-bold text-gray-300">404</h1>
            <p className="text-2xl text-gray-600 mt-4">Página Não Encontrada</p>
            <a
                href="/"
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Voltar para a Página Inicial
            </a>
        </div>

    )
}