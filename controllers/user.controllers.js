const UserController = {
    userLogin: async (req, res) => {
        try {
            return res.status(200).json({
                success: true,
                message: 'ok'
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                error: error.message,
              });
        }
    }
};

module.exports = UserController;