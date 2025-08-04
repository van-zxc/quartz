标签: [[数学]] [[多元函数微分]] [[全微分和偏导数]] [[概念]] [[线性代数]]

>[!definition]
>我们对函数组: 
>$$
>\begin{cases}
>F_{1}\ (x_{1}, \dots, x_{n}, y_{1}, \dots y_{m} ) = 0  \\ 
>F_{2}\ (x_{1}, \dots, x_{n}, y_{1}, \dots y_{m} ) = 0  \\
>\dots \\
>F_{m}\ (x_{1}, \dots, x_{n}, y_{1}, \dots y_{m} ) = 0 
>\end{cases}
>$$
>进行全微分. 可以得到其导数矩阵为: 
>$$
>\begin{pmatrix}
>\frac{ \partial F_{1} }{ \partial y_{1} }  & \dots & \frac{ \partial F_{1} }{ \partial y_{m} }  \\
>\vdots & \ddots & \vdots \\ \\
>\frac{ \partial F_{m} }{ \partial y_{1} }  & \dots & \frac{ \partial F_{m} }{ \partial y_{m} } 
>\end{pmatrix}
>$$
>我们记其行列式为: 
>$$
>\frac{D(F_{1}, \dots, F_{m})}{D(y_{1}, \dots y_{m})}
>$$
>称为$Jacobi$行列式