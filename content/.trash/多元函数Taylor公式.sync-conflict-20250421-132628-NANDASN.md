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
# n元Taylor公式

$$
f(x_{1}+\Delta x_{1},\dots x_{n}+\Delta x_{n}) = \sum_{k=0}^{m} \frac{1}{k!}\left( \sum_{i=1}^{n} \Delta x_{i} \frac{ \partial }{ \partial x_{i} } \right)^{n}f(x_{1}^{0},\dots x_{n}^{0})+R_{n}
$$
其中Lagrange余项为
$$
R_{n} = \frac{1}{(m+1)!}\left( \sum_{i=1}^{n} \Delta x_{i} \frac{ \partial }{ \partial x_{i} }  \right)^{m+1}f(x_{1}+\theta \Delta x_{1},\ \dots\ ,x_{n}+\theta \Delta x_{n})
$$

也可以使用分量写法写作