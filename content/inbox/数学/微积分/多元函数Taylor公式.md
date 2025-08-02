标签: [[数学]] [[多元函数微分]] [[公式]] 

类似[[Taylor展开]]. 

# 二元Taylor公式

我们忽略所有的良性定义和过程, 直接给出结果: 
$$
f(x_{0}+\Delta x, y_{0}+\Delta y) = 
f(x_{0}, y_{0}) + 
\left( \Delta x \frac{ \partial }{ \partial x } + 
\Delta y \frac{ \partial}{ \partial y } \right) f(x_{0}, y_{0}) + 
\frac{1}{2!}\left( \Delta x \frac{ \partial }{ \partial x } + 
\Delta y \frac{ \partial}{ \partial y } \right)^{2} f(x_{0}, y_{0}) + \dots + \frac{1}{n!}\left( \Delta x \frac{ \partial }{ \partial x } + \Delta y \frac{ \partial}{ \partial y } \right)^{n} f(x_{0}, y_{0}) + 
\frac{1}{(n+1)!}\left( \Delta x \frac{ \partial }{ \partial x } + \Delta y \frac{ \partial}{ \partial y } \right)^{n+1} f(x_{0}+\theta\Delta x, y_{0}+\theta\delta y)
$$
其中: 
$$
0<\theta<1
$$
$$
\left( \Delta x\frac{ \partial}{ \partial x } + \Delta y\frac{ \partial }{ \partial y }  \right)^{k}f(x, y) = \sum_{i=0}^{k} C_{k}^{i} \frac{ \partial^{k} f }{ \partial x_{k-i} \partial y_{i} } 
$$
# 多元Taylor公式

我们将$(x_1,x_2,\dots,x_n)$记作$\mathbf{x_0}$, 类似的记$\mathbf{\Delta x}$. 于是我们有：
$$
f(\mathbf{x_0} + \Delta \mathbf{x}) = \sum_{k=0}^{m} \frac{1}{k!}\left( \Delta x,\frac{ \partial}{ \partial x }  \right)^{k} f(\mathbf{x_0}) + R_x
$$
其中Lagrange余项为
$$
R_x = \frac{1}{(m+1)!}\left( \Delta x,\frac{ \partial }{ \partial x }  \right)^{m+1} f(\mathbf{x} + \theta \Delta \mathbf{x})
$$

# Hessian矩阵

如果是将函数表达式在二阶展开，那么Lagrange余项就会展开为：
$$
\frac{1}{2!}\Delta \mathbf{x} \,\mathbf{H}|_{x_0+\theta \Delta x} (\Delta x)^T
$$
其中H为一个矩阵代指符号，称为Hessian矩阵
$$
\mathbf{H} = 
\begin{pmatrix}
f'_{x_1x_1}(x) & f'_{x_1x_2}(x) & \dots & f'_{x_1x_n}(x) \\
\vdots & \vdots  & \vdots & \vdots \\
f'_{x_nx_1}(x) & f'_{x_nx_2}(x) & \dots & f'_{x_nx_n}(x)
\end{pmatrix}
$$