const validCategories = [
    'Tecnologia',
    'Alimentos',
    'Moda',
    'Construccion',
    'Energia-renovable',
    'Turismo',
    'Salud',
    'Educacion',
    'Logistica',
    'Artesania'
];

const validateCategory = (req, res, next) => {
    const { businessCategory } = req.body;

    if (!validCategories.includes(businessCategory)) {
        return res.status(400).json({
            message: `La categoría de negocio no es válida. Las categorías permitidas son: ${validCategories.join(', ')}`,
            error: "Categoría inválida",
        });
    }

    next();
};

export default validateCategory;