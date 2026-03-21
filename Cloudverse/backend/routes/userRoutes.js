router.post('/sync', ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const { email, firstName, lastName } = req.body;
        const clerkUserId = req.auth.userId;

        let user = await User.findOne({ clerkUserId });

        if (!user) {
            user = new User({
                clerkUserId,
                email,
                firstName,
                lastName,
                role: 'customer' // default
            });

            await user.save();
        }

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: "Sync error" });
    }
});