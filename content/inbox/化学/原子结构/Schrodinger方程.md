标签: [[物理]] [[化学]] [[公式]] [[量子力学]]

# 推导过程

使用波动方程来描述: 
$$
\psi = A\cos_{2}2\pi\left( \nu t - \frac{x}{\lambda} \right)
$$
可以给出函数的二阶导数: 
$$
\frac{\mathrm{d}^2\psi}{\mathrm{d}t^2} = -\left( \frac{2\pi}{\lambda} \right)^2 \psi
$$
代入德布罗意物质波波长: 
$$
\frac{\mathrm{d}^2\psi}{\mathrm{d}t^2} = -\left( \frac{2\pi}{\lambda} \right)^2 \psi = -\frac{4\pi^2m_{e}^2v^2}{h^2} \psi
$$
又因为电子的动能可以使用$\frac{1}{2}mv^2 = E-V$表示. 所以进一步改写上述式子: 
$$
\frac{h^2}{8\pi m^e} \frac{\mathrm{d}^2}{\mathrm{d}x^2}\psi + E\psi = V\psi
$$
这个就是薛定谔方程的一般公式. 

# 波函数的一般意义

我们已经知道光的能量密度和波函数的平方成正比. 即
$$
\omega \propto \psi^2
$$
同时我们也知道光的能量密度为
$$
\omega = \rho h \nu(\rho为光子密度)
$$
所以可以发现实际上$\psi^2$和光子密度$\rho$成正比. 

我们回到[[电子]]上: 我们说不清波函数$\psi$有什么含义, 但是我们可以把$\psi^2$看成是在某一点出现的**概率密度**. 在微小空间$\mathrm{d}r = \mathrm{d}x \mathrm{d}y \mathrm{d}z$中, 电子出现的概率$\omega = \psi^2 \mathrm{d}r$

显然的, 在所有地方发现的微观粒子的概率和为1. 由此得出非常重要的**归一化条件**: 
$$
\int_{-\infty}^{\infty}  \psi^2 \mathrm{d} \tau = 1 
$$

# 波函数的三个通解

$$
E = -\frac{Z^2m_{e}e^4}{8n^2h^2\varepsilon_{0}^2}
$$
$$
R(r) = -\sqrt{\left( \frac{2Z}{na_{0}} \right)^3 \frac{(n-i-1)!}{2n[(n+1)!]^3}} p^l e^{-\rho/2} L_{n+l}^{2l+1}(\rho)
$$

其中$\rho = \frac{2Zr}{na_{0}}$, $a_{0}$为玻尔半径, 
$$
L_{n+l}^{2l+1}(\rho) = \frac{\mathrm{d}^{2n+1}}{d\rho^{2l+1}}{e^{\rho} \frac{\mathrm{d}^{n+1}}{d \rho^{n+1}}(e^{-\rho}\rho^{n+1})}
$$
$$
Y(\theta, \psi) = \sqrt{ \left( \frac{2l+1}{4\pi} \right) \frac{(l-|m|)!}{(l+|m|)!} } P_{l}^{|m|} \cos\theta e^{i m \phi}
$$
其中
$$
P_{l}^{|m|} = \frac{1}{2^l l!} (1-\cos^2 \theta)^{|m|/2} \frac{\mathrm{d}^{l+|m|}}{\mathrm{d} \cos \theta^{l+|m|} (\cos^2 \theta -1)^l}
$$
# [[类氢原子]]